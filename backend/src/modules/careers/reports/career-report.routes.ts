import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.middleware";
import { careerReportController } from "./career-report.controller";

const careerReportRouter = Router();

careerReportRouter.use(authenticate);

// Student report endpoints
careerReportRouter.post("/generate", careerReportController.generateReport);
careerReportRouter.get("/latest", careerReportController.getLatestReport);
careerReportRouter.get("/student/:studentId", careerReportController.getStudentReportForCounsellor);
careerReportRouter.get("/:id/pdf", careerReportController.downloadReportPdf);
careerReportRouter.get("/:id", careerReportController.getReportById);

export { careerReportRouter };
