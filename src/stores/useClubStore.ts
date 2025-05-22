import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Club } from "../types/Club";

type ClubStore = {
  currentClubId: string | null;
  currentClub: Club | undefined;
  clubLogoPath: string | null;
  setCurrentClubId: (value: string | null) => void;
  setCurrentClub: (value: Club | undefined) => void;
  setClubLogoPath: (value: string | null) => void;
};

export const useClubStore = create<ClubStore>()(
  persist(
    (set) => ({
      currentClubId: null,
      currentClub: undefined,
      clubLogoPath: null,
      setCurrentClubId: (value) => set({ currentClubId: value }),
      setCurrentClub: (value) => set({ currentClub: value }),
      setClubLogoPath: (value) => set({ clubLogoPath: value }),
    }),
    {
      name: "club-store", // name of item in localStorage
    }
  )
);
