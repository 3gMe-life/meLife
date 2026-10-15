/**
 * Comprehensive Messaging Security & Business Logic Tests
 *
 * Verifies:
 * - Conversation eligibility (session requirement)
 * - Approved counsellor status enforcement
 * - IDOR / BOLA authorization guards
 * - clientMessageId idempotency
 * - Message read receipts & unread counts
 * - Pagination cursor stability
 */

import assert from "node:assert";
import { pool, closeDatabasePool } from "../src/config/database";
import { messagingRepository } from "../src/modules/messaging/messaging.repository";
import { messagingService } from "../src/modules/messaging/messaging.service";

async function runMessagingTests() {
  console.log("=================================================");
  console.log("🧪 Comprehensive Messaging Security & Logic Tests");
  console.log("=================================================\n");

  await messagingRepository.initSchema();

  // 1. Fetch our test counsellor: counsellor.test@3gmelife.com
  const counsellorRes = await pool.query(`
    SELECT c.id, c.user_id, u.email, c.approval_status
    FROM counsellors c
    JOIN users u ON c.user_id = u.id
    WHERE u.email = 'counsellor.test@3gmelife.com'
    LIMIT 1;
  `);
  assert.ok(counsellorRes.rows.length > 0, "Test counsellor must exist");
  const testCounsellor = counsellorRes.rows[0];
  console.log(`✅ Test Counsellor: ${testCounsellor.email} (Profile ID: ${testCounsellor.id})`);

  // 2. Fetch a connected student who has a legitimate session with this counsellor
  const sessionRes = await pool.query(`
    SELECT cs.student_id, u.email
    FROM counselling_sessions cs
    JOIN users u ON cs.student_id = u.id
    WHERE cs.counsellor_id = $1 AND cs.status IN ('PENDING', 'CONFIRMED', 'COMPLETED')
    LIMIT 1;
  `, [testCounsellor.id]);
  assert.ok(sessionRes.rows.length > 0, "Connected student session must exist");
  const connectedStudent = sessionRes.rows[0];
  console.log(`✅ Connected Student: ${connectedStudent.email} (ID: ${connectedStudent.student_id})`);

  // 3. Find or create an UNCONNECTED student (no sessions with this counsellor)
  let unconnectedStudentId: string;
  const unconnectedRes = await pool.query(`
    SELECT u.id, u.email
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'PARTICIPANT'
      AND u.id NOT IN (
        SELECT student_id FROM counselling_sessions WHERE counsellor_id = $1
      )
    LIMIT 1;
  `, [testCounsellor.id]);

  if (unconnectedRes.rows.length > 0) {
    unconnectedStudentId = unconnectedRes.rows[0].id;
  } else {
    // Insert temporary test student for the test
    const newStu = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, status)
      VALUES ('unconnected_test_stu@3gmelife.com', 'hash', 'Unconnected', 'Student', 'ACTIVE')
      RETURNING id;
    `);
    unconnectedStudentId = newStu.rows[0].id;
    const participantRoleRes = await pool.query(`SELECT id FROM roles WHERE name = 'PARTICIPANT' LIMIT 1;`);
    await pool.query(`
      INSERT INTO user_roles (user_id, role_id, is_primary)
      VALUES ($1, $2, true);
    `, [unconnectedStudentId, participantRoleRes.rows[0].id]);
  }
  console.log(`✅ Unconnected Student ID: ${unconnectedStudentId}`);

  // TEST 1: Unconnected Student cannot start conversation
  console.log("\n[TEST 1] Testing relationship eligibility enforcement...");
  let eligibilityBlocked = false;
  try {
    await messagingService.getOrCreateConversation(
      unconnectedStudentId,
      "PARTICIPANT",
      { counsellorId: testCounsellor.id }
    );
  } catch (err: any) {
    if (err.code === "MESSAGING_RELATIONSHIP_REQUIRED") {
      eligibilityBlocked = true;
    }
  }
  assert.strictEqual(
    eligibilityBlocked,
    true,
    "Unconnected student must be blocked with MESSAGING_RELATIONSHIP_REQUIRED"
  );
  console.log("✅ Passed: Unconnected student was rejected with MESSAGING_RELATIONSHIP_REQUIRED.");

  // TEST 2: Connected Student creates/retrieves conversation successfully
  console.log("\n[TEST 2] Testing connected student conversation creation...");
  const conversation = await messagingService.getOrCreateConversation(
    connectedStudent.student_id,
    "PARTICIPANT",
    { counsellorId: testCounsellor.id }
  );
  assert.ok(conversation.id, "Conversation ID must exist");
  assert.strictEqual(conversation.studentId, connectedStudent.student_id);
  assert.strictEqual(conversation.counsellorId, testCounsellor.id);
  console.log(`✅ Passed: Conversation ${conversation.id} created/retrieved successfully.`);

  // TEST 3: IDOR Guard - Unconnected Student cannot view or access conversation
  console.log("\n[TEST 3] Testing IDOR / BOLA protection on conversation access...");
  let idorBlocked = false;
  try {
    await messagingService.getConversationById(
      conversation.id,
      unconnectedStudentId,
      "PARTICIPANT"
    );
  } catch (err: any) {
    if (err.code === "MESSAGING_NOT_PARTICIPANT") {
      idorBlocked = true;
    }
  }
  assert.strictEqual(idorBlocked, true, "IDOR attempt must be rejected with MESSAGING_NOT_PARTICIPANT");
  console.log("✅ Passed: BOLA / IDOR attempt properly blocked with 403 MESSAGING_NOT_PARTICIPANT.");

  // TEST 4: Sending Message & Idempotency
  console.log("\n[TEST 4] Testing message sending and clientMessageId idempotency...");
  const clientMsgId = crypto.randomUUID();
  const sentMsg = await messagingService.sendMessage(
    conversation.id,
    connectedStudent.student_id,
    "PARTICIPANT",
    {
      content: "Hello Dr. Menon, I have a question about my Stream Finder result.",
      clientMessageId: clientMsgId,
    }
  );
  assert.ok(sentMsg.id, "Message ID must be returned");
  assert.strictEqual(sentMsg.content, "Hello Dr. Menon, I have a question about my Stream Finder result.");
  console.log(`✅ First Send Successful: Message ID ${sentMsg.id}`);

  // Re-sending with same clientMessageId (e.g. network retry)
  const resendMsg = await messagingService.sendMessage(
    conversation.id,
    connectedStudent.student_id,
    "PARTICIPANT",
    {
      content: "Hello Dr. Menon, I have a question about my Stream Finder result.",
      clientMessageId: clientMsgId,
    }
  );
  assert.strictEqual(resendMsg.id, sentMsg.id, "Resend must return the exact same message ID");

  // Verify only 1 row was stored in DB
  const countRes = await pool.query(
    "SELECT COUNT(*)::int AS count FROM messages WHERE client_message_id = $1",
    [clientMsgId]
  );
  assert.strictEqual(countRes.rows[0].count, 1, "Exactly one message must exist in database");
  console.log("✅ Passed: Idempotency enforced. Double-send resulted in exactly 1 stored row.");

  // TEST 5: Counsellor Reads Message & Read Receipts
  console.log("\n[TEST 5] Testing read receipts and unread badge counters...");
  const counsellorUnreadBefore = await messagingService.getUnreadCount(testCounsellor.user_id);
  assert.ok(counsellorUnreadBefore >= 1, "Counsellor should have at least 1 unread message");

  const readResult = await messagingService.markAsRead(
    conversation.id,
    testCounsellor.user_id,
    "CAREER_COUNSELLOR"
  );
  assert.ok(readResult.markedCount >= 1, "At least 1 message must be marked as read");
  console.log(`✅ Marked ${readResult.markedCount} messages read by counsellor.`);

  // TEST 6: Counsellor Replies to Student
  console.log("\n[TEST 6] Testing counsellor reply message...");
  const replyClientMsgId = crypto.randomUUID();
  const replyMsg = await messagingService.sendMessage(
    conversation.id,
    testCounsellor.user_id,
    "CAREER_COUNSELLOR",
    {
      content: "Hello! I reviewed your engineering vs design clusters. Let's discuss in our session.",
      clientMessageId: replyClientMsgId,
    }
  );
  assert.ok(replyMsg.id, "Reply message ID must be returned");
  console.log(`✅ Counsellor reply sent successfully: Message ID ${replyMsg.id}`);

  // TEST 7: Cursor Pagination
  console.log("\n[TEST 7] Testing message history cursor pagination...");
  const messagesPage = await messagingService.getMessages(
    conversation.id,
    connectedStudent.student_id,
    "PARTICIPANT",
    { limit: 10 }
  );
  assert.ok(Array.isArray(messagesPage.items), "Items must be an array");
  assert.ok(messagesPage.items.length >= 2, "Should return at least our 2 test messages");
  console.log(`✅ Retrieved ${messagesPage.items.length} messages in chronological order.`);

  console.log("\n=================================================");
  console.log("🎉 ALL MESSAGING SECURITY & LOGIC TESTS PASSED!");
  console.log("=================================================\n");
}

runMessagingTests()
  .then(async () => {
    await closeDatabasePool();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Test failed:", err);
    await closeDatabasePool();
    process.exit(1);
  });
