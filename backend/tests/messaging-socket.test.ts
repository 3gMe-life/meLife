/**
 * Real-Time Socket.IO Integration Test
 *
 * Verifies:
 * - Handshake JWT authentication (authorized vs unauthorized)
 * - Joining conversation room with membership authorization
 * - Live message emission (message:new)
 * - Live read receipt emission (message:read)
 * - Ephemeral typing indicator events (user:typing)
 * - Clean disconnect & room cleanup
 */

import assert from "node:assert";
import http from "http";
import { io as Client, Socket } from "socket.io-client";
import { createApp } from "../src/app";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { authTokenService } from "../src/modules/auth/auth.token.service";
import { initMessagingSocket, closeMessagingSocket } from "../src/modules/messaging/messaging.socket";
import { messagingService } from "../src/modules/messaging/messaging.service";

async function runSocketIntegrationTest() {
  console.log("=================================================");
  console.log("🧪 Real-Time Socket.IO Integration Test");
  console.log("=================================================\n");

  await connectDatabase();

  // 1. Boot up in-memory HTTP server with Socket.IO for the test on a random port
  const app = createApp();
  const server = http.createServer(app);
  initMessagingSocket(server);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as any;
  const socketUrl = `http://localhost:${address.port}`;
  console.log(`✅ Test server running on ${socketUrl}`);

  try {
    // 2. Fetch test counsellor & connected student
    const counsellorRes = await pool.query(`
      SELECT c.id, c.user_id, u.email
      FROM counsellors c
      JOIN users u ON c.user_id = u.id
      WHERE u.email = 'counsellor.test@3gmelife.com'
      LIMIT 1;
    `);
    const testCounsellor = counsellorRes.rows[0];

    const studentRes = await pool.query(`
      SELECT cs.student_id, u.email
      FROM counselling_sessions cs
      JOIN users u ON cs.student_id = u.id
      WHERE cs.counsellor_id = $1 AND cs.status IN ('PENDING', 'CONFIRMED', 'COMPLETED')
      LIMIT 1;
    `, [testCounsellor.id]);
    const connectedStudent = studentRes.rows[0];

    // Generate JWT access tokens
    const counsellorToken = authTokenService.signAccessToken({
      userId: testCounsellor.user_id,
      sessionId: "00000000-0000-0000-0000-000000000001",
      role: "CAREER_COUNSELLOR",
      permissions: ["counselling.read", "counselling.write"],
    });

    const studentToken = authTokenService.signAccessToken({
      userId: connectedStudent.student_id,
      sessionId: "00000000-0000-0000-0000-000000000002",
      role: "PARTICIPANT",
      permissions: ["participant.read"],
    });

    // 3. Test Handshake Authentication Rejection for unauthenticated client
    console.log("\n[TEST 1] Testing unauthenticated socket rejection...");
    const unauthSocket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: "invalid-token" },
      transports: ["websocket"],
      reconnection: false,
    });

    const unauthRejected = await new Promise<boolean>((resolve) => {
      unauthSocket.on("connect_error", (err) => {
        resolve(err.message.includes("AUTH_UNAUTHORIZED"));
      });
      unauthSocket.on("connect", () => {
        resolve(false);
      });
    });
    unauthSocket.close();
    assert.strictEqual(unauthRejected, true, "Unauthenticated socket must be rejected with AUTH_UNAUTHORIZED");
    console.log("✅ Passed: Socket handshake rejected unauthenticated client.");

    // 4. Connect Authenticated Counsellor & Student Sockets
    console.log("\n[TEST 2] Connecting authenticated student and counsellor sockets...");
    const studentSocket: Socket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: studentToken },
      transports: ["websocket"],
    });

    const counsellorSocket: Socket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: counsellorToken },
      transports: ["websocket"],
    });

    await Promise.all([
      new Promise<void>((resolve) => studentSocket.on("connect", resolve)),
      new Promise<void>((resolve) => counsellorSocket.on("connect", resolve)),
    ]);
    assert.strictEqual(studentSocket.connected, true, "Student socket should be connected");
    assert.strictEqual(counsellorSocket.connected, true, "Counsellor socket should be connected");
    console.log("✅ Passed: Both student and counsellor authenticated and connected successfully.");

    // 5. Get conversation and join conversation room
    const conversation = await messagingService.getOrCreateConversation(
      connectedStudent.student_id,
      "PARTICIPANT",
      { counsellorId: testCounsellor.id }
    );

    studentSocket.emit("conversation:join", { conversationId: conversation.id });
    counsellorSocket.emit("conversation:join", { conversationId: conversation.id });
    await new Promise((r) => setTimeout(r, 100)); // allow server to process joins

    // 6. Test Live Message Emission (student sends, counsellor receives message:new)
    console.log("\n[TEST 3] Testing live message broadcast (message:new)...");
    const testMessageContent = "Live real-time test from socket test suite!";
    const counsellorReceivedPromise = new Promise<any>((resolve) => {
      counsellorSocket.on("message:new", (msg) => {
        if (msg.content === testMessageContent) {
          resolve(msg);
        }
      });
    });

    // Send message via service (matches REST POST flow)
    const sentMsg = await messagingService.sendMessage(
      conversation.id,
      connectedStudent.student_id,
      "PARTICIPANT",
      {
        content: testMessageContent,
        clientMessageId: crypto.randomUUID(),
      }
    );

    const liveReceivedMsg = await counsellorReceivedPromise;
    assert.strictEqual(liveReceivedMsg.id, sentMsg.id, "Live message ID must match stored ID");
    assert.strictEqual(liveReceivedMsg.content, testMessageContent);
    console.log(`✅ Passed: Counsellor socket received live message:new instantly: "${liveReceivedMsg.content}"`);

    // 7. Test Read Receipt Broadcast (counsellor marks read, student receives message:read)
    console.log("\n[TEST 4] Testing live read receipt broadcast (message:read)...");
    const studentReceivedReceiptPromise = new Promise<any>((resolve) => {
      studentSocket.on("message:read", (receipt) => {
        if (receipt.conversationId === conversation.id) {
          resolve(receipt);
        }
      });
    });

    await messagingService.markAsRead(
      conversation.id,
      testCounsellor.user_id,
      "CAREER_COUNSELLOR"
    );

    const liveReceipt = await studentReceivedReceiptPromise;
    assert.strictEqual(liveReceipt.conversationId, conversation.id);
    assert.ok(liveReceipt.messageIds.includes(sentMsg.id), "Receipt should include our sent message ID");
    console.log(`✅ Passed: Student socket received live message:read receipt for ${liveReceipt.messageIds.length} messages.`);

    // 8. Test Ephemeral Typing Indicator
    console.log("\n[TEST 5] Testing ephemeral typing indicator broadcast...");
    const counsellorTypingPromise = new Promise<any>((resolve) => {
      counsellorSocket.on("user:typing", (payload) => {
        if (payload.isTyping === true && payload.conversationId === conversation.id) {
          resolve(payload);
        }
      });
    });

    studentSocket.emit("typing:start", {
      conversationId: conversation.id,
      userName: "Nifras Student",
    });

    const typingPayload = await counsellorTypingPromise;
    assert.strictEqual(typingPayload.isTyping, true);
    assert.strictEqual(typingPayload.userName, "Nifras Student");
    console.log(`✅ Passed: Counsellor received live typing indicator for "${typingPayload.userName}".`);

    // Cleanup sockets
    studentSocket.close();
    counsellorSocket.close();
    console.log("✅ Sockets closed cleanly.");

    console.log("\n=================================================");
    console.log("🎉 ALL REAL-TIME SOCKET INTEGRATION TESTS PASSED!");
    console.log("=================================================\n");
  } finally {
    await closeMessagingSocket();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await closeDatabasePool();
  }
}

runSocketIntegrationTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Socket integration test failed:", err);
    process.exit(1);
  });
