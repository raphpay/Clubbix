import { Timestamp } from "firebase/firestore";

export interface ClubWebsiteContent {
  id: string;
  clubId: string;
  clubName: string;
  headline: string;
  subtext: string;
  bannerImageUrl: string;
  logoUrl?: string;
  gallery: {
    id: string;
    imageUrl: string;
    caption: string;
    order: number;
  }[];
  events: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    isPublished: boolean;
  }[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface ClubWebsiteCard {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  order: number;
}

export interface ClubWebsiteSection {
  id: string;
  title: string;
  description: string;
  order: number;
  cards: ClubWebsiteCard[];
}
