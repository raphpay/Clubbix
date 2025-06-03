import { create } from "zustand";
import type { Activity, PricingPlan } from "../types/WebsitePage";

type NavLink = {
  label: string;
  href: string;
};

type TimeRange = { open: string; close: string };
type Schedule = { [day: string]: TimeRange[] };

type ClubWebsiteStore = {
  isEditing: boolean;
  logoPath: string | null;
  logoFile: File | null;
  logoUrl: string | null; // For display purposes
  clubName: string | null;
  navLinks: NavLink[];
  heroImageUrl: string | null; // For display purposes
  heroImagePath: string | null;
  heroImageFile: File | null;
  heroTitle: string | null;
  heroDescription: string | null;
  email: string | null;
  phone: string | null;
  instagramLink: string | null;
  facebookLink: string | null;
  activities: Activity[];
  sameLogoUploaded: Boolean;
  sameHeroImageUploaded: Boolean;
  pricingPlans: PricingPlan[];
  schedule: Schedule;
  setIsEditing: (edit: boolean) => void;
  setClubName: (name: string) => void;
  setLogoPath: (path: string) => void;
  setLogoFile: (file: File) => void;
  setLogoUrl: (url: string) => void;
  setNavLinks: (links: NavLink[]) => void;
  updateNavLink: (index: number, newLabel: string) => void;
  setHeroImageUrl: (url: string) => void;
  setHeroImagePath: (path: string) => void;
  setHeroImageFile: (file: File) => void;
  setHeroTitle: (title: string) => void;
  setHeroDescription: (desc: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setInstagramLink: (value: string) => void;
  setFacebookLink: (value: string) => void;
  setActivities: (activities: Activity[]) => void;
  setSameLogoUploaded: (value: Boolean) => void;
  setSameHeroImageUploaded: (value: Boolean) => void;
  setPricingPlans: (value: PricingPlan[]) => void;
  setSchedule: (schedule: Schedule) => void;
  addTimeRange: (day: string) => void;
  updateTimeRange: (
    day: string,
    index: number,
    key: "open" | "close",
    value: string
  ) => void;
  removeTimeRange: (day: string, index: number) => void;
};

export const useClubWebsiteStore = create<ClubWebsiteStore>((set) => ({
  isEditing: false,
  logoPath: null,
  logoFile: null,
  logoUrl: null,
  clubName: null,
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "A propos", href: "#about" },
    { label: "Evènements", href: "#events" },
  ],
  heroImageUrl: null,
  heroImagePath: null,
  heroImageFile: null,
  heroTitle: null,
  heroDescription: null,
  email: null,
  phone: null,
  instagramLink: null,
  facebookLink: null,
  activities: [],
  sameLogoUploaded: true,
  sameHeroImageUploaded: true,
  pricingPlans: [],
  schedule: {},
  setIsEditing: (edit) => set({ isEditing: edit }),
  setClubName: (name) => set({ clubName: name }),
  setLogoPath: (path) => set({ logoPath: path }),
  setLogoFile: (file) => set({ logoFile: file }),
  setLogoUrl: (url) => set({ logoUrl: url }),
  setNavLinks: (links) => set({ navLinks: links }),
  updateNavLink: (index, newLabel) =>
    set((state) => {
      const updated = [...state.navLinks];
      updated[index].label = newLabel;
      return { navLinks: updated };
    }),
  setHeroImageUrl: (url) => set({ heroImageUrl: url }),
  setHeroImagePath: (path) => set({ heroImagePath: path }),
  setHeroImageFile: (file) => set({ heroImageFile: file }),
  setHeroTitle: (title) => set({ heroTitle: title }),
  setHeroDescription: (desc) => set({ heroDescription: desc }),
  setEmail: (value) => set({ email: value }),
  setPhone: (value) => set({ phone: value }),
  setInstagramLink: (value) => set({ instagramLink: value }),
  setFacebookLink: (value) => set({ facebookLink: value }),
  setActivities: (value) => set({ activities: value }),
  setSameLogoUploaded: (value) => set({ sameLogoUploaded: value }),
  setSameHeroImageUploaded: (value) => set({ sameHeroImageUploaded: value }),
  setPricingPlans: (value) => set({ pricingPlans: value }),
  setSchedule: (value) => set({ schedule: value }),
  addTimeRange: (day) =>
    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: [...(state.schedule[day] || []), { open: "", close: "" }],
      },
    })),
  updateTimeRange: (day, index, key, value) =>
    set((state) => {
      const updated = [...(state.schedule[day] || [])];
      updated[index][key] = value;
      return {
        schedule: {
          ...state.schedule,
          [day]: updated,
        },
      };
    }),
  removeTimeRange: (day, index) =>
    set((state) => {
      const updated = [...(state.schedule[day] || [])];
      updated.splice(index, 1);
      return {
        schedule: {
          ...state.schedule,
          [day]: updated,
        },
      };
    }),
}));
