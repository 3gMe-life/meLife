import { institutionRepository } from "./institution.repository";
import { emailService } from "../email/email.service";
import { userRepository } from "../users/user.repository";
import { env } from "../../config/env";
import { logger } from "../../common/utils/logger";

const WORKER_INTERVAL_MS = 1500;
const BATCH_SIZE = 10;
const MAX_ATTEMPTS = 3;

export class InstitutionInvitationQueueWorker {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private isRunning = false;

  /**
   * Starts the background queue polling loop.
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextTick(100);
    logger.info("📬 Institution Invitation Background Queue Worker started.");
  }

  /**
   * Gracefully stops the worker loop.
   */
  stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    logger.info("🛑 Institution Invitation Background Queue Worker stopped.");
  }

  /**
   * Wakes up the worker immediately (called when new invitations are enqueued).
   */
  trigger(): void {
    if (!this.isRunning) return;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    setImmediate(() => this.processNextBatch());
  }

  private scheduleNextTick(delayMs = WORKER_INTERVAL_MS): void {
    if (!this.isRunning) return;
    this.timer = setTimeout(() => {
      this.processNextBatch();
    }, delayMs);
  }

  /**
   * Claims and processes a single batch of queued invitation email jobs.
   */
  async processNextBatch(): Promise<void> {
    if (this.isProcessing || !this.isRunning) {
      this.scheduleNextTick();
      return;
    }

    this.isProcessing = true;

    try {
      // 1. Claim batch of jobs atomically via SELECT FOR UPDATE SKIP LOCKED
      const jobs = await institutionRepository.claimQueuedEmailJobs(BATCH_SIZE);

      if (jobs.length === 0) {
        this.isProcessing = false;
        this.scheduleNextTick();
        return;
      }

      logger.info({ batchSize: jobs.length }, "Processing invitation email jobs batch");

      // 2. Process each claimed job with controlled rate limiting
      for (const job of jobs) {
        await this.processSingleJob(job);
      }

      this.isProcessing = false;
      // If full batch was processed, schedule immediate next tick to drain queue faster
      const nextDelay = jobs.length === BATCH_SIZE ? 200 : WORKER_INTERVAL_MS;
      this.scheduleNextTick(nextDelay);
    } catch (err) {
      logger.error({ err }, "Unexpected error in invitation queue worker batch");
      this.isProcessing = false;
      this.scheduleNextTick(5000); // Backoff on database error
    }
  }

  private async processSingleJob(job: {
    id: string;
    campaignId: string | null;
    invitationId: string;
    institutionId: string;
    institutionName: string;
    className: string | null;
    gradeLevel: string | null;
    division: string | null;
    recipientEmail: string;
    recipientName: string;
    rawToken?: string;
    attempts: number;
    maxAttempts: number;
    expiresAt: string;
  }): Promise<void> {
    try {
      const existingUser = await userRepository.findByEmail(job.recipientEmail);
      const inviteUrl = `${env.FRONTEND_URL}/invite/student/${job.rawToken}`;

      // Dispatch through transactional Resend email service
      const emailResult = await emailService.sendStudentInvitation({
        to: job.recipientEmail,
        studentName: job.recipientName,
        institutionName: job.institutionName,
        className: job.className,
        gradeLevel: job.gradeLevel,
        division: job.division,
        inviteUrl,
        expiresAt: job.expiresAt,
        hasExistingAccount: !!existingUser,
      });

      if (emailResult.success) {
        await institutionRepository.updateEmailJobSuccess(job.id, emailResult.messageId);
        logger.info(
          { jobId: job.id, email: job.recipientEmail, messageId: emailResult.messageId },
          "Invitation email dispatched successfully"
        );
      } else {
        const errorMessage = emailResult.error || "Failed to dispatch email";
        const isPermanent =
          errorMessage.toLowerCase().includes("invalid") ||
          errorMessage.toLowerCase().includes("does not exist") ||
          errorMessage.toLowerCase().includes("domain") ||
          errorMessage.toLowerCase().includes("sandbox") ||
          errorMessage.toLowerCase().includes("403") ||
          job.attempts + 1 >= (job.maxAttempts || MAX_ATTEMPTS);

        const nextAttempts = job.attempts + 1;
        const delaySeconds = Math.min(300, Math.pow(2, nextAttempts) * 10);
        const nextScheduledAt = isPermanent ? undefined : new Date(Date.now() + delaySeconds * 1000);

        await institutionRepository.updateEmailJobFailure(
          job.id,
          errorMessage,
          isPermanent,
          nextScheduledAt
        );

        logger.warn(
          { jobId: job.id, email: job.recipientEmail, isPermanent, nextAttempts, error: errorMessage },
          "Invitation email dispatch failed"
        );
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Unhandled worker error";
      const isPermanent = job.attempts + 1 >= (job.maxAttempts || MAX_ATTEMPTS);
      const nextScheduledAt = isPermanent ? undefined : new Date(Date.now() + 30000);

      await institutionRepository.updateEmailJobFailure(
        job.id,
        errorMessage,
        isPermanent,
        nextScheduledAt
      );

      logger.error({ err, jobId: job.id, email: job.recipientEmail }, "Error processing single email job");
    }
  }
}

export const institutionInvitationQueueWorker = new InstitutionInvitationQueueWorker();
