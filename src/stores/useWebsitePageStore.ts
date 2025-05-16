import { create } from "zustand";

type WebsitePageStore = {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

export const useWebsitePageStore = create<WebsitePageStore>((set) => ({
  isEditing: false,
  setIsEditing: (value) => set({ isEditing: value }),
}));
