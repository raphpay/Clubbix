import { create } from "zustand";
import type { WebsitePage } from "../types/WebsitePage";

type WebsitePageStore = {
  isEditing: boolean;
  currentWebsitePage: WebsitePage | undefined;
  currentWebsitePageId: string | undefined;
  setIsEditing: (value: boolean) => void;
  setCurrentWebsitePage: (value: WebsitePage | undefined) => void;
  setCurrentWebsitePageId: (value: string | undefined) => void;
};

export const useWebsitePageStore = create<WebsitePageStore>((set) => ({
  isEditing: false,
  currentWebsitePage: undefined,
  currentWebsitePageId: undefined,
  setIsEditing: (value) => set({ isEditing: value }),
  setCurrentWebsitePage: (value) => set({ currentWebsitePage: value }),
  setCurrentWebsitePageId: (value) => set({ currentWebsitePageId: value }),
}));
