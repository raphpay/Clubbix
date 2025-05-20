import { create } from "zustand";

type ClubStore = {
  currentClubId: string | null;
  setCurrentClubId: (value: string | null) => void;
};

export const useClubStore = create<ClubStore>((set) => ({
  currentClubId: null,
  setCurrentClubId: (value) => set({ currentClubId: value }),
}));
