import { create } from "zustand";

type DashboardSection =
  | "dashboard"
  | "members"
  | "events"
  | "trainings"
  | "finances"
  | "website"
  | "settings";

type DashboardStore = {
  section: DashboardSection;
  setSection: (section: DashboardSection) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  section: "dashboard",
  setSection: (section) => set({ section }),
}));
