import { createApp } from "./app";
import { env } from "./config/env";
import { APP_CONFIG } from "./config/app.config";
import { logger } from "./common/utils/logger";
import { connectDatabase, closeDatabasePool } from "./config/database";
import { authRepository } from "./modules/auth/auth.repository";
import { participantRepository } from "./modules/participants/participant.repository";
import { assessmentRepository } from "./modules/assessments/assessment.repository";
import { assessmentContentRepository } from "./modules/assessments/assessment-content.repository";
import { skillFinderQuestionSelectionService } from "./modules/assessments/services/skill-finder-question-selection.service";
import { streamFinderQuestionSelectionService } from "./modules/assessments/services/stream-finder-question-selection.service";
import { skillFinderTranslationsService } from "./modules/assessments/services/skill-finder-translations.service";
import { streamFinderTranslationsService } from "./modules/assessments/services/stream-finder-translations.service";
import { engineeringBranchFinderQuestionSelectionService } from "./modules/assessments/services/engineering-branch-finder-question-selection.service";
import { engineeringBranchFinderTranslationsService } from "./modules/assessments/services/engineering-branch-finder-translations.service";
import { commerceCareerFinderQuestionSelectionService } from "./modules/assessments/services/commerce-career-finder-question-selection.service";
import { commerceCareerFinderTranslationsService } from "./modules/assessments/services/commerce-career-finder-translations.service";
import { humanitiesCareerFinderQuestionSelectionService } from "./modules/assessments/services/humanities-career-finder-question-selection.service";
import { humanitiesCareerFinderTranslationsService } from "./modules/assessments/services/humanities-career-finder-translations.service";
import { rightCareerFinderQuestionSelectionService } from "./modules/assessments/services/right-career-finder-question-selection.service";
import { rightCareerFinderTranslationsService } from "./modules/assessments/services/right-career-finder-translations.service";
import { aiJobRiskFinderQuestionSelectionService } from "./modules/assessments/services/ai-job-risk-finder-question-selection.service";
import { aiJobRiskFinderTranslationsService } from "./modules/assessments/services/ai-job-risk-finder-translations.service";
import { entrepreneurDevelopmentQuestionSelectionService } from "./modules/assessments/services/entrepreneur-development-question-selection.service";
import { entrepreneurDevelopmentTranslationsService } from "./modules/assessments/services/entrepreneur-development-translations.service";
import { reportRepository } from "./modules/reports/report.repository";
import { careerRepository } from "./modules/careers/career.repository";
import { careerReportRepository } from "./modules/careers/reports/career-report.repository";
import { counsellingRepository } from "./modules/counselling/counselling.repository";
import { parentRepository } from "./modules/parent/parent.repository";
import { institutionRepository } from "./modules/institution/institution.repository";
import { institutionInvitationQueueWorker } from "./modules/institution/institution-invitation.worker";
import { adminRepository } from "./modules/admin/admin.repository";
import { messagingRepository } from "./modules/messaging/messaging.repository";
import { initMessagingSocket, closeMessagingSocket } from "./modules/messaging/messaging.socket";
import http from "http";

const bootstrap = async () => {
  try {
    // 1. Connect to PostgreSQL database
    await connectDatabase();

    // 2. Initialize Core Database Schemas
    await authRepository.initSchema();
    await authRepository.seedRolePermissions();
    await authRepository.seedDashboardFeatures();
    await participantRepository.initSchema();
    await parentRepository.initSchema();
    await assessmentRepository.initSchema();
    await assessmentContentRepository.initSchema();
    await reportRepository.initSchema();
    await careerRepository.initSchema();
    await careerReportRepository.initSchema();
    await counsellingRepository.initSchema();
    await institutionRepository.initSchema();
    await adminRepository.initInstitutionApplicationsSchema();
    await messagingRepository.initSchema();

    // 3. Initialize Express application & HTTP Server
    const app = createApp();
    const server = http.createServer(app);

    // Initialize real-time Socket.IO gateway attached to HTTP server
    initMessagingSocket(server);

    // 4. Start HTTP server immediately so frontend requests never get connection refused
    server.listen(env.PORT, () => {
      logger.info(
        `🚀 ${APP_CONFIG.serviceName} started in [${env.NODE_ENV}] mode on port ${env.PORT}`
      );
      logger.info(
        `🔗 API Base URL: http://localhost:${env.PORT}${APP_CONFIG.apiPrefix}`
      );
      logger.info(`🌐 Allowed Frontend: ${env.FRONTEND_URL}`);
    });

    // 5. Start background email queue worker
    institutionInvitationQueueWorker.start();

    // 6. Asynchronously seed content catalogs in the background (non-blocking)
    (async () => {
      try {
        await assessmentRepository.seedCatalog();
        await assessmentContentRepository.seedSkillFinderContent();
        await skillFinderQuestionSelectionService.seedSkillFinderVersions();
        await skillFinderTranslationsService.seedSkillFinderTranslations();
        await assessmentContentRepository.seedStreamFinderContent();
        await streamFinderQuestionSelectionService.seedStreamFinderVersions();
        await streamFinderTranslationsService.seedStreamFinderTranslations();
        await assessmentContentRepository.seedEngineeringBranchFinderContent();
        await engineeringBranchFinderQuestionSelectionService.seedEngineeringBranchFinderVersions();
        await engineeringBranchFinderTranslationsService.seedEngineeringBranchFinderTranslations();
        await assessmentContentRepository.seedCommerceCareerFinderContent();
        await commerceCareerFinderQuestionSelectionService.seedCommerceCareerFinderVersions();
        await commerceCareerFinderTranslationsService.seedCommerceCareerFinderTranslations();
        await assessmentContentRepository.seedHumanitiesCareerFinderContent();
        await humanitiesCareerFinderQuestionSelectionService.seedHumanitiesCareerFinderVersions();
        await humanitiesCareerFinderTranslationsService.seedHumanitiesCareerFinderTranslations();
        await assessmentContentRepository.seedRightCareerFinderContent();
        await rightCareerFinderQuestionSelectionService.seedRightCareerFinderVersions();
        await rightCareerFinderTranslationsService.seedRightCareerFinderTranslations();
        await assessmentContentRepository.seedAiJobRiskFinderContent();
        await aiJobRiskFinderQuestionSelectionService.seedAiJobRiskFinderVersions();
        await aiJobRiskFinderTranslationsService.seedAiJobRiskFinderTranslations();
        await assessmentContentRepository.seedEntrepreneurDevelopmentContent();
        await entrepreneurDevelopmentQuestionSelectionService.seedEntrepreneurDevelopmentVersions();
        await entrepreneurDevelopmentTranslationsService.seedEntrepreneurDevelopmentTranslations();
        await careerRepository.seedCareers();
      } catch (seedErr) {
        logger.warn({ err: seedErr }, "Background assessment content seed notice (non-fatal)");
      }
    })();

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.warn(`Received ${signal}. Starting graceful shutdown...`);
      institutionInvitationQueueWorker.stop();

      try {
        await closeMessagingSocket();
      } catch (socketErr) {
        logger.error({ err: socketErr }, "Error closing Socket.IO");
      }

      server.close(async (err) => {
        if (err) {
          logger.error({ err }, "Error during HTTP server close");
        } else {
          logger.info("HTTP server closed cleanly.");
        }

        // Close database pool
        await closeDatabasePool();

        logger.info("Graceful shutdown complete. Exiting process.");
        process.exit(err ? 1 : 0);
      });

      // Force close after 10s timeout
      setTimeout(() => {
        logger.error("Forced shutdown after timeout.");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.fatal({ reason }, "Unhandled Promise Rejection detected");
    });

    process.on("uncaughtException", (err) => {
      logger.fatal({ err }, "Uncaught Exception detected");
      process.exit(1);
    });
  } catch (error) {
    logger.fatal({ err: error }, "Application bootstrap failed");
    process.exit(1);
  }
};

bootstrap();
