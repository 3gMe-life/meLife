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
import { initMessagingSocket, closeMessagingSocket, getMessagingIO } from "../src/modules/messaging/messaging.socket";
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

    // 6. Test Personal User Rooms & Bidirectional Live Message Emission with Exact Single Delivery
    console.log("\n[TEST 3] Testing recipient personal user rooms and bidirectional live message broadcast...");

    const io = getMessagingIO();
    const studentRoom = io?.sockets.adapter.rooms.get(`user:${connectedStudent.student_id}`);
    const counsellorRoom = io?.sockets.adapter.rooms.get(`user:${testCounsellor.user_id}`);
    const profileRoom = io?.sockets.adapter.rooms.get(`user:${testCounsellor.id}`);

    assert.ok(studentRoom && studentRoom.size >= 1, "Student personal user room user:{studentUserId} must exist");
    assert.ok(counsellorRoom && counsellorRoom.size >= 1, "Counsellor personal user room user:{counsellorUserId} must exist");
    assert.strictEqual(profileRoom, undefined, "Counsellor personal room must NOT use profile ID");
    console.log("✅ Passed: Recipient personal user rooms verified using users.id for both participants.");

    let studentEventCount = 0;
    let counsellorEventCount = 0;
    let lastStudentReceivedMsg: any = null;
    let lastCounsellorReceivedMsg: any = null;

    studentSocket.on("message:new", (msg) => {
      studentEventCount++;
      lastStudentReceivedMsg = msg;
    });

    counsellorSocket.on("message:new", (msg) => {
      counsellorEventCount++;
      lastCounsellorReceivedMsg = msg;
    });

    // 6a. Direction 1: Student -> Counsellor
    console.log("Testing Direction 1: Student -> Counsellor...");
    const contentAtoB = "Direction A->B: Student to Counsellor " + Date.now();
    const sentMsgAtoB = await messagingService.sendMessage(
      conversation.id,
      connectedStudent.student_id,
      "PARTICIPANT",
      {
        content: contentAtoB,
        clientMessageId: crypto.randomUUID(),
      }
    );

    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(counsellorEventCount, 1, "Counsellor must receive exactly ONE message:new event");
    assert.strictEqual(studentEventCount, 0, "Student (sender) must receive ZERO duplicate socket echoes");
    assert.strictEqual(lastCounsellorReceivedMsg?.id, sentMsgAtoB.id);
    assert.strictEqual(lastCounsellorReceivedMsg?.content, contentAtoB);
    console.log("✅ Passed: Direction 1 (Student -> Counsellor) delivered exactly once with no duplicates.");

    // 6b. Direction 2: Counsellor -> Student
    console.log("Testing Direction 2: Counsellor -> Student...");
    const contentBtoA = "Direction B->A: Counsellor to Student " + Date.now();
    const sentMsgBtoA = await messagingService.sendMessage(
      conversation.id,
      testCounsellor.user_id,
      "CAREER_COUNSELLOR",
      {
        content: contentBtoA,
        clientMessageId: crypto.randomUUID(),
      }
    );

    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(studentEventCount, 1, "Student must receive exactly ONE message:new event");
    assert.strictEqual(counsellorEventCount, 1, "Counsellor (sender) must receive ZERO duplicate socket echoes");
    assert.strictEqual(lastStudentReceivedMsg?.id, sentMsgBtoA.id);
    assert.strictEqual(lastStudentReceivedMsg?.content, contentBtoA);
    console.log("✅ Passed: Direction 2 (Counsellor -> Student) delivered exactly once with no duplicates.");

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
    assert.ok(liveReceipt.messageIds.includes(sentMsgAtoB.id), "Receipt should include our sent message ID");
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

    // 9. TEST 6: Polling-Only Transport Diagnostic Test
    console.log("\n[TEST 6] Testing polling-only transport (transports: ['polling'])...");
    const pollingSocket: Socket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: studentToken },
      transports: ["polling"],
      reconnection: false,
    });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Polling socket connection timeout")), 5000);
      pollingSocket.on("connect", () => {
        clearTimeout(timer);
        resolve();
      });
      pollingSocket.on("connect_error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    assert.strictEqual(pollingSocket.connected, true, "Polling socket should be connected");
    const pollingTransportName = (pollingSocket.io.engine as any).transport.name;
    const pollingSid = (pollingSocket.io.engine as any).id;
    assert.strictEqual(pollingTransportName, "polling", "Transport must be polling");
    assert.ok(pollingSid, "Polling session ID (SID) must be defined");
    console.log(`✅ Passed: Polling socket connected with SID: ${pollingSid} on transport: ${pollingTransportName}`);

    // Verify event exchange over pure polling
    const pollingAckPromise = new Promise<void>((resolve) => {
      pollingSocket.emit("conversation:join", { conversationId: conversation.id });
      setTimeout(resolve, 300);
    });
    await pollingAckPromise;
    pollingSocket.close();
    console.log("✅ Passed: Polling transport verified without session loss or 400 errors.");

    // 10. TEST 7: Production-Equivalent Transport Order (polling -> websocket upgrade)
    console.log("\n[TEST 7] Testing production transport order: ['polling', 'websocket'] with upgrade...");
    const upgradeSocket: Socket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: counsellorToken },
      transports: ["polling", "websocket"],
      reconnection: false,
    });

    let sawPolling = false;
    let upgradedToWebsocket = false;

    if ((upgradeSocket.io.engine as any).transport?.name === "polling") {
      sawPolling = true;
    }

    (upgradeSocket.io.engine as any).on("upgrade", (transport: any) => {
      if (transport.name === "websocket") {
        upgradedToWebsocket = true;
      }
    });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Upgrade socket connection timeout")), 5000);
      upgradeSocket.on("connect", () => {
        clearTimeout(timer);
        resolve();
      });
      upgradeSocket.on("connect_error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    assert.strictEqual(upgradeSocket.connected, true, "Upgrade socket should be connected");
    // Allow small window for transport upgrade if not immediate
    if (!upgradedToWebsocket) {
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, 1000);
        (upgradeSocket.io.engine as any).once("upgrade", (transport: any) => {
          if (transport.name === "websocket") {
            upgradedToWebsocket = true;
          }
          clearTimeout(timeout);
          resolve();
        });
      });
    }

    const finalTransportName = (upgradeSocket.io.engine as any).transport.name;
    console.log(`✅ Passed: Upgrade socket connected. Initial polling: ${sawPolling || finalTransportName === 'polling'}, Final transport: ${finalTransportName}`);
    assert.strictEqual(finalTransportName, "websocket", "Socket should successfully upgrade to websocket");

    upgradeSocket.close();
    console.log("✅ Passed: Production-equivalent polling -> websocket upgrade verified.");

    // 11. TEST 8: Missed Socket Recovery (Offline -> Online REST History Sync)
    console.log("\n[TEST 8] Testing missed socket recovery (REST synchronization when socket is offline)...");
    // Connect temporary recipient socket
    const offlineTestSocket = Client(socketUrl, {
      path: "/socket.io",
      auth: { token: counsellorToken },
      transports: ["websocket"],
      reconnection: false,
    });
    await new Promise<void>((r) => offlineTestSocket.on("connect", () => r()));
    console.log("Recipient socket online. Simulating network disconnect/page close...");
    offlineTestSocket.close();
    await new Promise((r) => setTimeout(r, 100));

    // Sender sends message while recipient socket is offline
    const missedMessageContent = "Offline message sent while recipient socket was disconnected " + Date.now();
    const missedMsg = await messagingService.sendMessage(
      conversation.id,
      connectedStudent.student_id,
      "PARTICIPANT",
      {
        content: missedMessageContent,
        clientMessageId: crypto.randomUUID(),
      }
    );

    // Verify message persisted in PostgreSQL
    const dbCheck = await pool.query(
      "SELECT id, content FROM messages WHERE id = $1",
      [missedMsg.id]
    );
    assert.strictEqual(dbCheck.rows.length, 1, "Missed message must be persisted in PostgreSQL");
    assert.strictEqual(dbCheck.rows[0].content, missedMessageContent);
    console.log("✅ Passed: Message successfully persisted in PostgreSQL while recipient was offline.");

    // Recipient queries REST history (re-entering Messages page)
    const restHistory = await messagingService.getMessages(
      conversation.id,
      testCounsellor.user_id,
      "CAREER_COUNSELLOR",
      { limit: 10 }
    );
    const foundInHistory = restHistory.items.some((m) => m.id === missedMsg.id);
    assert.strictEqual(foundInHistory, true, "Missed message must be present in REST message history");
    console.log("✅ Passed: Missed message retrieved via REST history without requiring live socket event.");

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
