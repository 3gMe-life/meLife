import { companyRepository } from "./company.repository";
import {
  CompanyOverviewResponseDTO,
  CompanyUserItemDTO,
  CompanyStudentItemDTO,
  CompanyInstitutionItemDTO,
  CompanyCounsellorItemDTO,
  CompanyAssessmentAllocationItemDTO,
  CompanySessionItemDTO,
  CompanyReportSummaryDTO,
  CompanyInvitationItemDTO,
  CreateCompanyInvitationDTO,
  BulkCompanyInvitationDTO,
  UpdateCompanySettingsDTO,
  CompanyEntity,
} from "./company.types";

export class CompanyService {
  /**
   * Resolves the authenticated user's company tenant context.
   */
  async resolveCompanyContext(userId: string): Promise<CompanyEntity> {
    return companyRepository.resolveCompanyForUser(userId);
  }

  /**
   * Retrieves company overview metrics & recent activity.
   */
  async getCompanyOverview(userId: string): Promise<CompanyOverviewResponseDTO> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.getCompanyOverview(company.id);
  }

  /**
   * Retrieves company users directory.
   */
  async listCompanyUsers(userId: string, search?: string): Promise<CompanyUserItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanyUsers(company.id, search);
  }

  /**
   * Invites a new user to the company workspace.
   */
  async inviteUser(userId: string, dto: CreateCompanyInvitationDTO): Promise<CompanyUserItemDTO> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.inviteUserToCompany(company.id, dto);
  }

  /**
   * Handles bulk user invitations.
   */
  async bulkInviteUsers(
    userId: string,
    dto: BulkCompanyInvitationDTO
  ): Promise<{ invitedCount: number; users: CompanyUserItemDTO[] }> {
    const company = await this.resolveCompanyContext(userId);
    const results: CompanyUserItemDTO[] = [];

    for (const item of dto.invitations) {
      const user = await companyRepository.inviteUserToCompany(company.id, item);
      results.push(user);
    }

    return {
      invitedCount: results.length,
      users: results,
    };
  }

  /**
   * Toggles company user active status.
   */
  async updateUserStatus(userId: string, targetUserId: string, isActive: boolean): Promise<void> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.updateCompanyUserStatus(company.id, targetUserId, isActive);
  }

  /**
   * Retrieves company students.
   */
  async listCompanyStudents(userId: string, search?: string): Promise<CompanyStudentItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanyStudents(company.id, search);
  }

  /**
   * Retrieves affiliated institutions.
   */
  async listCompanyInstitutions(userId: string): Promise<CompanyInstitutionItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanyInstitutions(company.id);
  }

  /**
   * Retrieves counsellors network.
   */
  async listCompanyCounsellors(): Promise<CompanyCounsellorItemDTO[]> {
    return companyRepository.findCompanyCounsellors();
  }

  /**
   * Retrieves assessment allocations.
   */
  async listCompanyAssessments(userId: string): Promise<CompanyAssessmentAllocationItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanyAssessments(company.id);
  }

  /**
   * Allocates an assessment to an affiliated institution.
   */
  async allocateAssessment(
    userId: string,
    data: { institutionId: string; assessmentCode: string; title: string; deadline?: string }
  ): Promise<CompanyAssessmentAllocationItemDTO> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.allocateAssessment(company.id, data);
  }

  /**
   * Retrieves company counselling sessions.
   */
  async listCompanySessions(userId: string): Promise<CompanySessionItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanySessions(company.id);
  }

  /**
   * Retrieves company report analytics.
   */
  async getCompanyReports(userId: string): Promise<CompanyReportSummaryDTO> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.getCompanyReports(company.id);
  }

  /**
   * Retrieves company invitations.
   */
  async listCompanyInvitations(userId: string): Promise<CompanyInvitationItemDTO[]> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.findCompanyInvitations(company.id);
  }

  /**
   * Retrieves company settings.
   */
  async getCompanySettings(userId: string): Promise<CompanyEntity> {
    return this.resolveCompanyContext(userId);
  }

  /**
   * Updates company settings.
   */
  async updateCompanySettings(
    userId: string,
    dto: UpdateCompanySettingsDTO
  ): Promise<CompanyEntity> {
    const company = await this.resolveCompanyContext(userId);
    return companyRepository.updateCompanySettings(company.id, dto);
  }
}

export const companyService = new CompanyService();
