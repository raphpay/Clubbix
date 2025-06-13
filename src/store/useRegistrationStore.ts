import { create } from "zustand";

type Role = "admin" | "member";
type Step = "initial" | "details";

interface RegistrationState {
  role: Role;
  step: Step;
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
  setFormData: (data: Partial<RegistrationState["formData"]>) => void;
  resetForm: () => void;
}

const initialState = {
  role: "member" as Role,
  step: "initial" as Step,
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
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set(initialState),
}));
