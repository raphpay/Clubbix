import { create } from "zustand";

type Role = "admin" | "member";
type Step = "initial" | "details";
type BillingCycle = "monthly" | "annual";
type Plan = "starter" | "pro" | "elite";

interface RegistrationState {
  role: Role;
  step: Step;
  selectedPlan?: Plan;
  selectedBillingCycle?: BillingCycle;
  formData: {
    clubName?: string;
    logo?: File | null;
    inviteCode?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  setRole: (role: Role) => void;
  setStep: (step: Step) => void;
  setSelectedPlan: (plan: Plan | undefined) => void;
  setSelectedBillingCycle: (billingCycle: BillingCycle | undefined) => void;
  setFormData: (data: Partial<RegistrationState["formData"]>) => void;
  resetForm: () => void;
}

const initialState = {
  role: "member" as Role,
  step: "initial" as Step,
  selectedPlan: undefined as Plan | undefined,
  selectedBillingCycle: undefined as BillingCycle | undefined,
  formData: {
    clubName: "",
    logo: null,
    inviteCode: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  setRole: (role) => set({ role, step: "initial" }),
  setStep: (step) => set({ step }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setSelectedBillingCycle: (billingCycle) =>
    set({ selectedBillingCycle: billingCycle }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set(initialState),
}));
