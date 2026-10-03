import { Request, Response, NextFunction } from "express";
import { companyService } from "./company.service";
import { AppError } from "../../common/errors/app-error";

export class CompanyController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const overview = await companyService.getCompanyOverview(userId);
      res.status(200).json({ success: true, data: overview });
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const search = req.query.search ? String(req.query.search) : undefined;
      const users = await companyService.listCompanyUsers(userId, search);
      res.status(200).json({ success: true, data: { users, count: users.length } });
    } catch (err) {
      next(err);
    }
  }

  async inviteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const { email, firstName, lastName, role, institutionId, classId } = req.body;
      if (!email || !firstName || !lastName) {
        throw AppError.badRequest("Email, first name, and last name are required.");
      }
      const user = await companyService.inviteUser(userId, {
        email,
        firstName,
        lastName,
        role,
        institutionId,
        classId,
      });
      res.status(201).json({ success: true, message: "User invited successfully.", data: user });
    } catch (err) {
      next(err);
    }
  }

  async bulkInviteUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const { invitations } = req.body;
      if (!Array.isArray(invitations) || invitations.length === 0) {
        throw AppError.badRequest("Invitations array is required.");
      }
      const result = await companyService.bulkInviteUsers(userId, { invitations });
      res.status(201).json({ success: true, message: "Batch invitations processed.", data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const targetUserId = req.params.userId as string;
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        throw AppError.badRequest("isActive boolean flag is required.");
      }
      await companyService.updateUserStatus(userId, targetUserId, isActive);
      res.status(200).json({ success: true, message: "User status updated successfully." });
    } catch (err) {
      next(err);
    }
  }

  async listStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const search = req.query.search ? String(req.query.search) : undefined;
      const students = await companyService.listCompanyStudents(userId, search);
      res.status(200).json({ success: true, data: { students, count: students.length } });
    } catch (err) {
      next(err);
    }
  }

  async listInstitutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const institutions = await companyService.listCompanyInstitutions(userId);
      res.status(200).json({ success: true, data: { institutions, count: institutions.length } });
    } catch (err) {
      next(err);
    }
  }

  async listCounsellors(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counsellors = await companyService.listCompanyCounsellors();
      res.status(200).json({ success: true, data: { counsellors, count: counsellors.length } });
    } catch (err) {
      next(err);
    }
  }

  async listAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const assessments = await companyService.listCompanyAssessments(userId);
      res.status(200).json({ success: true, data: { assessments, count: assessments.length } });
    } catch (err) {
      next(err);
    }
  }

  async allocateAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const { institutionId, assessmentCode, title, deadline } = req.body;
      if (!institutionId || !assessmentCode || !title) {
        throw AppError.badRequest("Institution ID, assessment code, and title are required.");
      }
      const allocation = await companyService.allocateAssessment(userId, {
        institutionId,
        assessmentCode,
        title,
        deadline,
      });
      res.status(201).json({ success: true, message: "Assessment allocated successfully.", data: allocation });
    } catch (err) {
      next(err);
    }
  }

  async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const sessions = await companyService.listCompanySessions(userId);
      res.status(200).json({ success: true, data: { sessions, count: sessions.length } });
    } catch (err) {
      next(err);
    }
  }

  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const reports = await companyService.getCompanyReports(userId);
      res.status(200).json({ success: true, data: reports });
    } catch (err) {
      next(err);
    }
  }

  async listInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const invitations = await companyService.listCompanyInvitations(userId);
      res.status(200).json({ success: true, data: { invitations, count: invitations.length } });
    } catch (err) {
      next(err);
    }
  }

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const settings = await companyService.getCompanySettings(userId);
      res.status(200).json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw AppError.unauthorized();
      const updated = await companyService.updateCompanySettings(userId, req.body);
      res.status(200).json({ success: true, message: "Settings updated successfully.", data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const companyController = new CompanyController();
