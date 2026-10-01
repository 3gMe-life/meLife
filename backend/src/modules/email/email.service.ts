import { Resend } from "resend";
import { env } from "../../config/env";
import { logger } from "../../common/utils/logger";
import { emailTemplates } from "./email.templates";
import {
  SendEmailOptions,
  EmailSendResult,
  WelcomeEmailPayload,
  PasswordResetEmailPayload,
  InstitutionApplicationSubmittedPayload,
  InstitutionApplicationApprovedPayload,
  InstitutionApplicationRejectedPayload,
  CounsellorApplicationSubmittedPayload,
  CounsellorApplicationApprovedPayload,
  CounsellorApplicationRejectedPayload,
  ParentInvitationEmailPayload,
  ParentLinkedEmailPayload,
  SessionBookedEmailPayload,
  SessionCancelledEmailPayload,
  AssessmentCompletedEmailPayload,
} from "./email.types";

export class EmailService {
  private resend: Resend | null = null;
  private readonly defaultFrom: string;

  constructor() {
    this.defaultFrom = env.EMAIL_FROM || "3G MeLife <onboarding@resend.dev>";

    if (env.RESEND_API_KEY && env.RESEND_API_KEY.startsWith("re_")) {
      try {
        this.resend = new Resend(env.RESEND_API_KEY);
        logger.info("📧 Resend Email Service initialized successfully.");
      } catch (err) {
        logger.warn({ err }, "Failed to initialize Resend client, fallback to mock mode.");
        this.resend = null;
      }
    } else {
      logger.warn("⚠️ RESEND_API_KEY not configured or invalid. Operating in simulated email mode.");
    }
  }

  /**
   * Core dispatch method wrapping Resend API with comprehensive error boundaries.
   * Sending an email will NEVER throw an unhandled exception or break callers.
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailSendResult> {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const from = options.from || this.defaultFrom;

    // Simulated / Offline Development Mode
    if (!this.resend) {
      logger.info(
        {
          to: recipients,
          subject: options.subject,
          from,
          simulated: true,
        },
        `[MOCK EMAIL] To: ${recipients.join(", ")} | Subject: "${options.subject}"`
      );
      return {
        success: true,
        messageId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
    }

    try {
      const response = await this.resend.emails.send({
        from,
        to: recipients,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      });

      if (response.error) {
        logger.warn(
          {
            error: response.error,
            to: recipients,
            subject: options.subject,
          },
          "Resend API returned an error while sending email"
        );
        return {
          success: false,
          error: response.error.message || "Email dispatch failed",
        };
      }

      logger.info(
        {
          messageId: response.data?.id,
          to: recipients,
          subject: options.subject,
        },
        "Email delivered successfully via Resend"
      );

      return {
        success: true,
        messageId: response.data?.id,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown email dispatch error";
      logger.error(
        {
          err,
          to: recipients,
          subject: options.subject,
        },
        "Unexpected error occurred during email transmission"
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // ==========================================
  // TRANSACTIONAL TEMPLATE DISPATCHERS
  // ==========================================

  /**
   * Dispatches welcome email on participant, parent, or general account creation.
   */
  async sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<EmailSendResult> {
    const template = emailTemplates.welcome(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches password reset link email.
   */
  async sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<EmailSendResult> {
    const template = emailTemplates.passwordReset(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches institution application submission receipt.
   */
  async sendInstitutionApplicationSubmitted(
    payload: InstitutionApplicationSubmittedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.institutionApplicationSubmitted(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches institution application approved with portal credentials.
   */
  async sendInstitutionApplicationApproved(
    payload: InstitutionApplicationApprovedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.institutionApplicationApproved(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches institution application rejection feedback.
   */
  async sendInstitutionApplicationRejected(
    payload: InstitutionApplicationRejectedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.institutionApplicationRejected(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches counsellor application submission receipt.
   */
  async sendCounsellorApplicationSubmitted(
    payload: CounsellorApplicationSubmittedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.counsellorApplicationSubmitted(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches counsellor approval & activation notice.
   */
  async sendCounsellorApplicationApproved(
    payload: CounsellorApplicationApprovedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.counsellorApplicationApproved(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches counsellor application rejection notice.
   */
  async sendCounsellorApplicationRejected(
    payload: CounsellorApplicationRejectedPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.counsellorApplicationRejected(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches parent invitation code email.
   */
  async sendParentInvitationEmail(
    payload: ParentInvitationEmailPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.parentInvitation(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches parent account linked confirmation.
   */
  async sendParentLinkedEmail(payload: ParentLinkedEmailPayload): Promise<EmailSendResult> {
    const template = emailTemplates.parentLinked(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches 1-on-1 career guidance session confirmation.
   */
  async sendSessionBookedEmail(payload: SessionBookedEmailPayload): Promise<EmailSendResult> {
    const template = emailTemplates.sessionBooked(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches guidance session cancellation notice.
   */
  async sendSessionCancelledEmail(
    payload: SessionCancelledEmailPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.sessionCancelled(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Dispatches psychometric assessment completed / report ready email.
   */
  async sendAssessmentCompletedEmail(
    payload: AssessmentCompletedEmailPayload
  ): Promise<EmailSendResult> {
    const template = emailTemplates.assessmentCompleted(payload);
    return this.sendEmail({
      to: payload.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

export const emailService = new EmailService();
