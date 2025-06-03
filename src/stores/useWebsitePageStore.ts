import { create } from "zustand";
import type { WebsitePage } from "../types/WebsitePage";

type WebsitePageStore = {
  // Properties
  currentWebsitePage: WebsitePage | undefined;
  // Setters
  setCurrentWebsitePage: (value: WebsitePage | undefined) => void;
};

export const useWebsitePageStore = create<WebsitePageStore>((set) => ({
  // Properties
  currentWebsitePage: undefined,
  // Setters
  setCurrentWebsitePage: (value) => set({ currentWebsitePage: value }),
}));
