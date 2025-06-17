import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import { db, storage } from "../../config/firebase";
import { ClubWebsiteContent } from "./types";

export const uploadWebsiteImage = async (
  clubId: string | undefined,
  file: File,
  type: "banner" | "gallery" | "event"
): Promise<string> => {
  if (!clubId) return "";
  const fileNameWithDate = `${Date.now()}-${file.name}`;
  const storageRef = ref(
    storage,
    `clubs/${clubId}/website/${type}/${fileNameWithDate}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const getClubWebsiteContent = async (
  clubId: string
): Promise<ClubWebsiteContent | null> => {
  const websiteRef = doc(db, "clubWebsites", clubId);
  const websiteDoc = await getDoc(websiteRef);

  if (!websiteDoc.exists()) {
    return null;
  }

  return websiteDoc.data() as ClubWebsiteContent;
};

export const createClubWebsiteContent = async (
  clubId: string,
  content: Omit<ClubWebsiteContent, "id" | "clubId" | "updatedAt" | "createdAt">
): Promise<void> => {
  const websiteRef = doc(db, "clubWebsites", clubId);

  await setDoc(websiteRef, {
    ...content,
    id: clubId,
    clubId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const updateClubWebsiteContent = async (
  clubId: string,
  content: Partial<
    Omit<ClubWebsiteContent, "id" | "clubId" | "updatedAt" | "createdAt">
  >
): Promise<void> => {
  const websiteRef = doc(db, "clubWebsites", clubId);

  await updateDoc(websiteRef, {
    ...content,
    updatedAt: serverTimestamp(),
  });
};

export const addGalleryImage = async (
  clubId: string,
  image: File,
  caption: string
): Promise<void> => {
  const websiteRef = doc(db, "clubWebsites", clubId);
  const websiteDoc = await getDoc(websiteRef);
  const websiteData = websiteDoc.data() as ClubWebsiteContent;

  const imageUrl = await uploadWebsiteImage(clubId, image, "gallery");
  const newImage = {
    id: nanoid(),
    imageUrl,
    caption,
    order: websiteData.gallery.length,
  };

  await updateDoc(websiteRef, {
    gallery: [...websiteData.gallery, newImage],
    updatedAt: serverTimestamp(),
  });
};

export const addEvent = async (
  clubId: string,
  event: {
    title: string;
    description: string;
    image: File;
    date: Date;
  }
): Promise<void> => {
  const websiteRef = doc(db, "clubWebsites", clubId);
  const websiteDoc = await getDoc(websiteRef);
  const websiteData = websiteDoc.data() as ClubWebsiteContent;

  const imageUrl = await uploadWebsiteImage(clubId, event.image, "event");
  const newEvent = {
    id: nanoid(),
    title: event.title,
    description: event.description,
    imageUrl,
    date: event.date,
    isPublished: false,
  };

  await updateDoc(websiteRef, {
    events: [...websiteData.events, newEvent],
    updatedAt: serverTimestamp(),
  });
};

export const updateEvent = async (
  clubId: string | undefined,
  eventId: string,
  updates: Partial<{
    title: string;
    description: string;
    image: File;
    date: Date;
    isPublished: boolean;
  }>
): Promise<void> => {
  if (!clubId) return;
  const websiteRef = doc(db, "clubWebsites", clubId);
  const websiteDoc = await getDoc(websiteRef);
  const websiteData = websiteDoc.data() as ClubWebsiteContent;

  const eventIndex = websiteData.events.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return;

  const updatedEvent = { ...websiteData.events[eventIndex] };

  if (updates.image) {
    updatedEvent.imageUrl = await uploadWebsiteImage(
      clubId,
      updates.image,
      "event"
    );
  }

  if (updates.title) updatedEvent.title = updates.title;
  if (updates.description) updatedEvent.description = updates.description;
  if (updates.date) updatedEvent.date = updates.date;
  if (typeof updates.isPublished === "boolean")
    updatedEvent.isPublished = updates.isPublished;

  const updatedEvents = [...websiteData.events];
  updatedEvents[eventIndex] = updatedEvent;

  await updateDoc(websiteRef, {
    events: updatedEvents,
    updatedAt: serverTimestamp(),
  });
};
