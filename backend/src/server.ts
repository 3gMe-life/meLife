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
import { skillFinderTranslationsService } from "./modules/assessments/services/skill-finder-translations.service";
import { reportRepository } from "./modules/reports/report.repository";
import { careerRepository } from "./modules/careers/career.repository";
import { careerReportRepository } from "./modules/careers/reports/career-report.repository";
import { counsellingRepository } from "./modules/counselling/counselling.repository";
import http from "http";

const bootstrap = async () => {
  try {
    // 1. Connect to PostgreSQL database
    await connectDatabase();

    // 2. Ensure initial role permissions are seeded
    await authRepository.seedRolePermissions();

    // 3. Initialize participant schema & migrations
    await participantRepository.initSchema();

    // 4. Initialize assessment catalog schema & seed official catalog
    await assessmentRepository.initSchema();
    await assessmentRepository.seedCatalog();

    // 5. Initialize assessment runner schema & seed Skill Finder question bank & versions
    await assessmentContentRepository.initSchema();
    await assessmentContentRepository.seedSkillFinderContent();
    await skillFinderQuestionSelectionService.seedSkillFinderVersions();
    await skillFinderTranslationsService.seedSkillFinderTranslations();

    // 6. Initialize psychometric reports schema
    await reportRepository.initSchema();

    // 7. Initialize career pathways schema & seed curated career library
    await careerRepository.initSchema();
    await careerRepository.seedCareers();

    // 8. Initialize career guidance reports schema
    await careerReportRepository.initSchema();

    // 9. Initialize counsellor connect schema & seed certified counsellors
    await counsellingRepository.initSchema();
    await counsellingRepository.seedCounsellors();

    // 9. Initialize Express application
    const app = createApp();
    const server = http.createServer(app);

    // 7. Start HTTP server
    server.listen(env.PORT, () => {
      logger.info(
        `🚀 ${APP_CONFIG.serviceName} started in [${env.NODE_ENV}] mode on port ${env.PORT}`
      );
      logger.info(
        `🔗 API Base URL: http://localhost:${env.PORT}${APP_CONFIG.apiPrefix}`
      );
      logger.info(`🌐 Allowed Frontend: ${env.FRONTEND_URL}`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.warn(`Received ${signal}. Starting graceful shutdown...`);

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
    logger.fatal({ error }, "Application bootstrap failed");
    process.exit(1);
  }
};

bootstrap();
