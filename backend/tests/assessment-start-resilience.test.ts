import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";
import { authRepository } from "../src/modules/auth/auth.repository";
import { userRepository } from "../src/modules/users/user.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";

async function runResilienceTests() {
  console.log("🧪 Testing Assessment Start Resilience against Stale / Dynamic UUIDs...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();

  const timestamp = Date.now();
  const testUser = await userRepository.createUser({
    email: `resilience.${timestamp}@example.com`,
    passwordHash: "hash123",
    firstName: "Resilience",
    lastName: "Tester",
    role: "PARTICIPANT",
    status: "ACTIVE",
  });

  // 1. Test starting via code 'SKILL_FINDER'
  const res1 = await assessmentRunnerService.startOrCreateAttempt(testUser.id, "SKILL_FINDER");
  console.log("✅ PASS: Started attempt via code 'SKILL_FINDER':", res1.attemptId);

  // 2. Test starting / resuming using the active attemptId directly
  const res2 = await assessmentRunnerService.startOrCreateAttempt(testUser.id, res1.attemptId);
  console.log("✅ PASS: Resumed attempt using attemptId directly:", res2.attemptId);
  if (res2.attemptId !== res1.attemptId) {
    throw new Error("Attempt ID mismatch when resuming directly!");
  }

  // 3. Test starting with a random/stale UUID like '7adcb35d-f9cd-4e03-88aa-dc25de5a5631'
  const staleUuid = "7adcb35d-f9cd-4e03-88aa-dc25de5a5631";
  const res3 = await assessmentRunnerService.startOrCreateAttempt(testUser.id, staleUuid);
  console.log("✅ PASS: Resiliently recovered from stale UUID:", staleUuid, "-> resumed attemptId:", res3.attemptId);
  if (res3.attemptId !== res1.attemptId) {
    throw new Error("Failed to recover user's active attempt on stale UUID!");
  }

  // 4. Test starting with a fresh user who provides a stale UUID (should fallback to default SKILL_FINDER)
  const freshUser = await userRepository.createUser({
    email: `fresh.${timestamp}@example.com`,
    passwordHash: "hash123",
    firstName: "Fresh",
    lastName: "Student",
    role: "PARTICIPANT",
    status: "ACTIVE",
  });

  const res4 = await assessmentRunnerService.startOrCreateAttempt(freshUser.id, staleUuid);
  console.log("✅ PASS: Fresh user with stale UUID gracefully initialized default SKILL_FINDER attempt:", res4.attemptId);

  await closeDatabasePool();
  console.log("\n🎉 All resilience tests passed successfully!");
}

runResilienceTests().catch((err) => {
  console.error("Resilience test failed:", err);
  process.exit(1);
});
