import { create } from "zustand";
import type { RegistrationPath } from "../types/auth.types";

interface GuardianDraft {
  name: string;
  phone: string;
  email?: string;
}

interface AuthFlowState {
  // Registration selection path
  registrationPath: RegistrationPath;
  setRegistrationPath: (path: RegistrationPath) => void;

  // Student Onboarding modal state
  isOnboardingModalOpen: boolean;
  onboardingStep: 1 | 2;
  educationStage: string | null;
  guardianDraft: GuardianDraft | null;

  // Application/Registration submission completion message state
  submissionFeedback: {
    type: RegistrationPath;
    title: string;
    message: string;
  } | null;

  // Actions
  setOnboardingModalOpen: (isOpen: boolean) => void;
  setOnboardingStep: (step: 1 | 2) => void;
  setEducationStage: (stage: string | null) => void;
  setGuardianDraft: (draft: GuardianDraft | null) => void;
  setSubmissionFeedback: (
    feedback: { type: RegistrationPath; title: string; message: string } | null
  ) => void;
  resetFlow: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  registrationPath: "STUDENT",
  setRegistrationPath: (path) => set({ registrationPath: path, submissionFeedback: null }),

  isOnboardingModalOpen: false,
  onboardingStep: 1,
  educationStage: null,
  guardianDraft: null,
  submissionFeedback: null,

  setOnboardingModalOpen: (isOpen) => set({ isOnboardingModalOpen: isOpen }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setEducationStage: (stage) => set({ educationStage: stage }),
  setGuardianDraft: (draft) => set({ guardianDraft: draft }),
  setSubmissionFeedback: (feedback) => set({ submissionFeedback: feedback }),

  resetFlow: () =>
    set({
      registrationPath: "STUDENT",
      isOnboardingModalOpen: false,
      onboardingStep: 1,
      educationStage: null,
      guardianDraft: null,
      submissionFeedback: null,
    }),
}));
