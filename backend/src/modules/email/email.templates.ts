import {
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
  StudentInvitationEmailPayload,
} from "./email.types";

/**
 * Base email layout wrapper with 3G MeLife branding, responsive styles, and footer.
 */
function baseTemplate(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4F8F7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #172B2A;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F4F8F7;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      border: 1px solid #E3ECEA;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(23, 43, 42, 0.04);
    }
    .header {
      background: linear-gradient(135deg, #172B2A 0%, #0D3834 100%);
      padding: 32px 32px 28px 32px;
      text-align: left;
    }
    .brand-badge {
      display: inline-block;
      background-color: #00BFA5;
      color: #172B2A;
      font-weight: 900;
      font-size: 14px;
      padding: 4px 10px;
      border-radius: 8px;
      letter-spacing: 0.5px;
    }
    .brand-title {
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 800;
      margin: 8px 0 0 0;
      letter-spacing: -0.3px;
    }
    .brand-subtitle {
      color: #9FB3B0;
      font-size: 12px;
      margin: 4px 0 0 0;
    }
    .content {
      padding: 36px 32px;
      font-size: 14px;
      line-height: 1.6;
      color: #334E4B;
    }
    .content h1 {
      font-size: 22px;
      font-weight: 800;
      color: #172B2A;
      margin: 0 0 16px 0;
      letter-spacing: -0.5px;
    }
    .content p {
      margin: 0 0 16px 0;
    }
    .callout {
      background-color: #F4F8F7;
      border: 1px solid #E3ECEA;
      border-left: 4px solid #00BFA5;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 24px 0;
      font-size: 13px;
    }
    .callout-warning {
      border-left-color: #E65100;
      background-color: #FFF8E1;
    }
    .btn-container {
      margin: 32px 0;
      text-align: left;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #00B8D4 0%, #00BFA5 100%);
      color: #172B2A !important;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0, 191, 165, 0.25);
    }
    .credentials-box {
      background-color: #172B2A;
      color: #F7FAF9;
      border-radius: 16px;
      padding: 20px;
      margin: 24px 0;
      font-family: monospace;
      font-size: 13px;
    }
    .credentials-box .item {
      margin-bottom: 8px;
    }
    .credentials-box .item:last-child {
      margin-bottom: 0;
    }
    .credentials-box .label {
      color: #00BFA5;
      font-weight: bold;
    }
    .footer {
      background-color: #F9FBFA;
      border-top: 1px solid #E3ECEA;
      padding: 24px 32px;
      text-align: center;
      font-size: 11px;
      color: #728B88;
    }
    .footer a {
      color: #008F83;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="brand-badge">3G</span>
        <h2 class="brand-title">3G MeLife</h2>
        <p class="brand-subtitle">Psychometric Assessment & Career Guidance Platform</p>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} 3G MeLife. All rights reserved.</p>
        <p>This is a secure automated notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export const emailTemplates = {
  /**
   * 1. Welcome Email (Student / Parent / General)
   */
  welcome(payload: WelcomeEmailPayload): { subject: string; html: string; text: string } {
    const name = payload.firstName || "there";
    const dashboardUrl = payload.dashboardUrl || "http://localhost:3000/login";
    const subject = "Welcome to 3G MeLife - Begin Your Career Journey";

    const html = baseTemplate(
      subject,
      `
      <h1>Welcome to 3G MeLife, ${name}! 🎉</h1>
      <p>Your account has been successfully created and configured. You now have access to our psychometric assessment batteries, scientifically backed career mapping, and personalized advisory tools.</p>
      
      <div class="callout">
        <strong>Your Registered Role:</strong> ${payload.role.replace(/_/g, " ")}<br>
        <strong>Email:</strong> ${payload.to}
      </div>

      <p>Log in to your personalized portal to take assessments, review your cognitive orientation, or connect with expert guidance counsellors.</p>

      <div class="btn-container">
        <a href="${dashboardUrl}" class="btn">Go to Your Dashboard →</a>
      </div>

      <p>If you have any questions or need support, our guidance specialists are here to help.</p>
    `
    );

    const text = `Welcome to 3G MeLife, ${name}!\n\nYour account has been created with role: ${payload.role}.\nLog in at: ${dashboardUrl}`;

    return { subject, html, text };
  },

  /**
   * 2. Password Reset Request
   */
  passwordReset(payload: PasswordResetEmailPayload): { subject: string; html: string; text: string } {
    const name = payload.firstName || "there";
    const subject = "Reset Your 3G MeLife Password";
    const expiresIn = payload.expiresInMinutes || 15;

    const html = baseTemplate(
      subject,
      `
      <h1>Password Reset Request</h1>
      <p>Hello ${name},</p>
      <p>We received a request to reset the password for your 3G MeLife account (${payload.to}). Click the button below to choose a new password.</p>

      <div class="btn-container">
        <a href="${payload.resetUrl}" class="btn">Reset My Password →</a>
      </div>

      <div class="callout">
        <strong>Security Notice:</strong> This link will expire in <strong>${expiresIn} minutes</strong>. If you did not request this change, please ignore this email or contact support.
      </div>
    `
    );

    const text = `Hello ${name},\n\nWe received a password reset request. Reset your password here: ${payload.resetUrl} (Expires in ${expiresIn} minutes).`;

    return { subject, html, text };
  },

  /**
   * 3. Institution Application Received (Confirmation to School)
   */
  institutionApplicationSubmitted(payload: InstitutionApplicationSubmittedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Application Received: ${payload.institutionName} - 3G MeLife`;

    const html = baseTemplate(
      subject,
      `
      <h1>Institution Application Received</h1>
      <p>Dear ${payload.contactName},</p>
      <p>Thank you for submitting an institutional partnership application for <strong>${payload.institutionName}</strong> (${payload.institutionType}).</p>

      <div class="callout">
        <strong>Institution:</strong> ${payload.institutionName}<br>
        <strong>Type:</strong> ${payload.institutionType}<br>
        <strong>Status:</strong> Under Review by Platform Administration
      </div>

      <p>Our accreditation verification team is currently reviewing your documentation and educational board affiliations. You will receive an update as soon as the verification is complete.</p>
    `
    );

    const text = `Dear ${payload.contactName},\n\nYour institution application for ${payload.institutionName} has been received and is currently under review.`;

    return { subject, html, text };
  },

  /**
   * 4. Institution Application Approved & Account Provisioned
   */
  institutionApplicationApproved(payload: InstitutionApplicationApprovedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Application Approved: Welcome ${payload.institutionName} to 3G MeLife`;
    const loginUrl = payload.loginUrl || "http://localhost:3000/login";

    const html = baseTemplate(
      subject,
      `
      <h1>Congratulations! Your Institution is Approved 🎉</h1>
      <p>Dear ${payload.contactName},</p>
      <p>We are delighted to inform you that the application for <strong>${payload.institutionName}</strong> has been approved by the 3G MeLife Platform Administration.</p>
      <p>Your institutional portal has been provisioned with initial grade cohorts, assessment allocation tools, and student directory management.</p>

      <div class="credentials-box">
        <div class="item"><span class="label">Institution:</span> ${payload.institutionName}</div>
        <div class="item"><span class="label">Institution Code:</span> ${payload.institutionCode}</div>
        <div class="item"><span class="label">Portal Login Email:</span> ${payload.to}</div>
        ${
          payload.temporaryPassword
            ? `<div class="item"><span class="label">Temporary Password:</span> ${payload.temporaryPassword}</div>`
            : ""
        }
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Access Institution Portal →</a>
      </div>

      <p>Please log in and update your security credentials under Settings upon initial access.</p>
    `
    );

    const text = `Congratulations! ${payload.institutionName} has been approved on 3G MeLife.\nInstitution Code: ${payload.institutionCode}\nLogin Email: ${payload.to}\nLogin URL: ${loginUrl}`;

    return { subject, html, text };
  },

  /**
   * 5. Institution Application Rejected
   */
  institutionApplicationRejected(payload: InstitutionApplicationRejectedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Update regarding your 3G MeLife Institution Application: ${payload.institutionName}`;

    const html = baseTemplate(
      subject,
      `
      <h1>Institution Application Status Update</h1>
      <p>Dear ${payload.contactName},</p>
      <p>Thank you for your interest in partnering with 3G MeLife for <strong>${payload.institutionName}</strong>.</p>
      <p>After careful review of the submitted documentation, we are unable to approve your application at this time.</p>

      ${
        payload.reason
          ? `
      <div class="callout callout-warning">
        <strong>Reviewer Feedback:</strong><br>
        ${payload.reason}
        ${payload.reviewNotes ? `<p style="margin-top: 8px; font-size: 12px;">${payload.reviewNotes}</p>` : ""}
      </div>
      `
          : ""
      }

      <p>If you believe this was in error or if you have updated accreditation documents, please contact our support team.</p>
    `
    );

    const text = `Dear ${payload.contactName},\n\nUpdate regarding your institution application for ${payload.institutionName}.\nReason: ${payload.reason || "Documentation could not be verified."}`;

    return { subject, html, text };
  },

  /**
   * 6. Counsellor Application Submitted (Receipt)
   */
  counsellorApplicationSubmitted(payload: CounsellorApplicationSubmittedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = "Counsellor Application Received - 3G MeLife";

    const html = baseTemplate(
      subject,
      `
      <h1>Counsellor Application Submitted</h1>
      <p>Dear ${payload.applicantName},</p>
      <p>Thank you for applying to join 3G MeLife as a Certified Career Guidance Counsellor.</p>

      <div class="callout">
        <strong>Submitted Qualification:</strong> ${payload.qualification || "Credentials Uploaded"}<br>
        <strong>Organization / Practice:</strong> ${payload.organization || "Independent Practitioner"}<br>
        <strong>Status:</strong> Pending Credentials Verification
      </div>

      <p>Our clinical & administrative audit team is reviewing your professional qualifications. We will notify you once your practitioner portal is active.</p>
    `
    );

    const text = `Dear ${payload.applicantName},\n\nYour application to become a certified counsellor on 3G MeLife has been received and is pending verification.`;

    return { subject, html, text };
  },

  /**
   * 7. Counsellor Application Approved
   */
  counsellorApplicationApproved(payload: CounsellorApplicationApprovedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = "Application Approved: Welcome to the 3G MeLife Practitioner Network";
    const dashboardUrl = payload.dashboardUrl || "http://localhost:3000/login";

    const html = baseTemplate(
      subject,
      `
      <h1>Welcome to the Certified Counsellor Network! 🎉</h1>
      <p>Dear ${payload.applicantName},</p>
      <p>We are pleased to inform you that your credentials have been verified and your application has been approved.</p>
      <p>Your account now has full access to the **Counsellor Portal**, where you can manage availability, accept guidance bookings, and view student psychometric dossiers.</p>

      <div class="btn-container">
        <a href="${dashboardUrl}" class="btn">Open Counsellor Portal →</a>
      </div>
    `
    );

    const text = `Dear ${payload.applicantName},\n\nYour counsellor credentials have been verified and approved. Access your dashboard at: ${dashboardUrl}`;

    return { subject, html, text };
  },

  /**
   * 8. Counsellor Application Rejected
   */
  counsellorApplicationRejected(payload: CounsellorApplicationRejectedPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = "Update on your 3G MeLife Counsellor Application";

    const html = baseTemplate(
      subject,
      `
      <h1>Counsellor Application Status Update</h1>
      <p>Dear ${payload.applicantName},</p>
      <p>Thank you for your interest in joining 3G MeLife as a career counsellor.</p>
      <p>After reviewing your submission, our team is unable to approve your application at this time.</p>

      ${
        payload.reason
          ? `
      <div class="callout callout-warning">
        <strong>Review Notes:</strong><br>
        ${payload.reason}
      </div>
      `
          : ""
      }
    `
    );

    const text = `Dear ${payload.applicantName},\n\nUpdate on your counsellor application.\nReason: ${payload.reason || "Credentials could not be verified."}`;

    return { subject, html, text };
  },

  /**
   * 9. Parent Invitation Email
   */
  parentInvitation(payload: ParentInvitationEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `${payload.studentName} has invited you to connect on 3G MeLife`;

    const html = baseTemplate(
      subject,
      `
      <h1>Connect with ${payload.studentName}'s Career Journey</h1>
      <p>Hello${payload.parentName ? ` ${payload.parentName}` : ""},</p>
      <p><strong>${payload.studentName}</strong> has invited you to link your parent account on 3G MeLife to review their psychometric evaluation results, career trajectory recommendations, and guidance milestones.</p>

      <div class="callout">
        <strong>Your Invitation Code:</strong><br>
        <span style="font-family: monospace; font-size: 20px; font-weight: 900; color: #008F83; letter-spacing: 2px;">${payload.inviteCode}</span>
      </div>

      <p>Click below to redeem your invitation directly or sign in to your parent portal:</p>

      <div class="btn-container">
        <a href="${payload.redeemUrl}" class="btn">Connect Parent Account →</a>
      </div>

      <p style="font-size: 12px; color: #728B88;">This invitation code is valid for 7 days.</p>
    `
    );

    const text = `${payload.studentName} invited you to connect on 3G MeLife.\nInvitation Code: ${payload.inviteCode}\nConnect here: ${payload.redeemUrl}`;

    return { subject, html, text };
  },

  /**
   * 10. Parent Linked Confirmation
   */
  parentLinked(payload: ParentLinkedEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = "Parent-Student Account Linked - 3G MeLife";
    const dashboardUrl = payload.dashboardUrl || "http://localhost:3000/login";

    const html = baseTemplate(
      subject,
      `
      <h1>Account Connection Confirmed 🤝</h1>
      <p>Hello ${payload.recipientName},</p>
      <p>Your account has been successfully linked with <strong>${payload.linkedPartyName}</strong> (${payload.role === "PARENT" ? "Student" : "Parent/Guardian"}).</p>
      <p>You can now collaborate on career roadmaps and track psychometric milestones together.</p>

      <div class="btn-container">
        <a href="${dashboardUrl}" class="btn">View Linked Profile →</a>
      </div>
    `
    );

    const text = `Hello ${payload.recipientName},\n\nYour account is now linked with ${payload.linkedPartyName}.\nDashboard: ${dashboardUrl}`;

    return { subject, html, text };
  },

  /**
   * 11. Guidance Session Booked
   */
  sessionBooked(payload: SessionBookedEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Guidance Session Confirmed: ${payload.studentName} & ${payload.counsellorName}`;

    const html = baseTemplate(
      subject,
      `
      <h1>Career Guidance Session Confirmed 📅</h1>
      <p>Hello ${payload.recipientName},</p>
      <p>Your 1-on-1 career guidance session has been successfully booked.</p>

      <div class="callout">
        <strong>Student:</strong> ${payload.studentName}<br>
        <strong>Counsellor:</strong> ${payload.counsellorName}<br>
        <strong>Date:</strong> ${payload.sessionDate}${payload.timeSlot ? `<br><strong>Time:</strong> ${payload.timeSlot}` : ""}
        ${payload.meetingLink ? `<br><strong>Meeting Link:</strong> <a href="${payload.meetingLink}" style="color: #008F83;">${payload.meetingLink}</a>` : ""}
      </div>

      <p>Please ensure you are in a quiet environment with a stable internet connection 5 minutes prior to the session start time.</p>
    `
    );

    const text = `Guidance session confirmed between ${payload.studentName} and ${payload.counsellorName} on ${payload.sessionDate}.`;

    return { subject, html, text };
  },

  /**
   * 12. Guidance Session Cancelled
   */
  sessionCancelled(payload: SessionCancelledEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Session Cancelled: Guidance Session on ${payload.sessionDate}`;

    const html = baseTemplate(
      subject,
      `
      <h1>Guidance Session Cancelled</h1>
      <p>Hello ${payload.recipientName},</p>
      <p>The guidance session between <strong>${payload.studentName}</strong> and <strong>${payload.counsellorName}</strong> scheduled for <strong>${payload.sessionDate}</strong> has been cancelled.</p>

      ${
        payload.reason
          ? `
      <div class="callout callout-warning">
        <strong>Reason:</strong> ${payload.reason}
      </div>
      `
          : ""
      }

      <p>You can visit the booking calendar to select an alternative date and time slot.</p>
    `
    );

    const text = `Guidance session between ${payload.studentName} and ${payload.counsellorName} on ${payload.sessionDate} was cancelled.`;

    return { subject, html, text };
  },

  /**
   * 13. Assessment Completed & Report Ready
   */
  assessmentCompleted(payload: AssessmentCompletedEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = `Your Assessment Report is Ready: ${payload.assessmentTitle}`;

    const html = baseTemplate(
      subject,
      `
      <h1>Your Psychometric Report is Ready! 📊</h1>
      <p>Hello ${payload.studentName},</p>
      <p>Congratulations on completing the <strong>${payload.assessmentTitle}</strong>!</p>
      <p>Your responses have been processed by our psychometric evaluation algorithms. Your personalized career orientation and strengths breakdown are now ready for review.</p>

      <div class="btn-container">
        <a href="${payload.reportUrl}" class="btn">View Psychometric Report →</a>
      </div>
    `
    );

    const text = `Hello ${payload.studentName},\n\nYour report for ${payload.assessmentTitle} is ready. View it here: ${payload.reportUrl}`;

    return { subject, html, text };
  },

  /**
   * 14. Student Institutional Onboarding Invitation
   */
  studentInvitation(payload: StudentInvitationEmailPayload): {
    subject: string;
    html: string;
    text: string;
  } {
    const cohortDisplay = payload.className || (payload.gradeLevel ? `Grade ${payload.gradeLevel}${payload.division ? `-${payload.division}` : ""}` : "Academic Cohort");
    const subject = `Invitation to join ${payload.institutionName} on 3G MeLife`;
    const expiryStr = typeof payload.expiresAt === "string" ? new Date(payload.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : payload.expiresAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const html = baseTemplate(
      subject,
      `
      <h1>Institutional Student Invitation 🎓</h1>
      <p>Hello <strong>${payload.studentName}</strong>,</p>
      <p><strong>${payload.institutionName}</strong> has invited you to join their digital student cohort on the 3G MeLife Psychometric & Career Guidance Platform.</p>

      <div class="callout">
        <strong>Institution:</strong> ${payload.institutionName}<br>
        <strong>Assigned Cohort:</strong> ${cohortDisplay}<br>
        <strong>Invited Email:</strong> ${payload.to}
      </div>

      <p>${payload.hasExistingAccount ? "Since you already have a 3G MeLife account, you can sign in to securely link your profile to this cohort." : "Click below to activate your student account, set your password, and access your assigned assessments and psychometric reports."}</p>

      <div class="btn-container">
        <a href="${payload.inviteUrl}" class="btn">Accept Invitation & Get Started →</a>
      </div>

      <div class="callout callout-warning">
        <strong>Security Notice:</strong> This invitation is secure, single-use, and valid until <strong>${expiryStr}</strong>. Do not forward or share this link with anyone.
      </div>
    `
    );

    const text = `Hello ${payload.studentName},\n\n${payload.institutionName} has invited you to join ${cohortDisplay} on 3G MeLife.\n\nAccept your invitation here: ${payload.inviteUrl}\n(Valid until ${expiryStr})`;

    return { subject, html, text };
  },
};
