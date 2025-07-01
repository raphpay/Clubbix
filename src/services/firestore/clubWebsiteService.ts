import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { db, storage } from "../../config/firebase";
import {
  ClubWebsiteCard,
  ClubWebsiteContent,
  ClubWebsiteSection,
} from "./types/clubWebsite";

// READ
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

// Get all sections for a website, ordered
export const getSections = async (
  websiteId: string
): Promise<ClubWebsiteSection[]> => {
  const sectionsRef = collection(db, `clubWebsites/${websiteId}/sections`);
  const q = query(sectionsRef, orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as ClubWebsiteSection)
  );
};

// CREATE/ADD
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

// Add or update a section
export const saveSection = async (
  websiteId: string,
  section: Omit<ClubWebsiteSection, "id"> & { id?: string }
) => {
  const sectionId =
    section.id || doc(collection(db, `clubWebsites/${websiteId}/sections`)).id;
  const sectionRef = doc(db, `clubWebsites/${websiteId}/sections/${sectionId}`);
  await setDoc(
    sectionRef,
    { ...section, id: sectionId, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return sectionId;
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

// Save a card (add or update) within a section
export const saveCard = async (
  websiteId: string,
  sectionId: string,
  card: Omit<ClubWebsiteCard, "id"> & { id?: string }
) => {
  const sectionRef = doc(db, `clubWebsites/${websiteId}/sections/${sectionId}`);
  const sectionSnap = await getDoc(sectionRef);
  if (!sectionSnap.exists()) throw new Error("Section not found");
  const section = sectionSnap.data() as ClubWebsiteSection;
  const cards = section.cards || [];
  let updatedCards;
  if (card.id) {
    updatedCards = cards.map((c) => (c.id === card.id ? { ...c, ...card } : c));
  } else {
    const newCard = { ...card, id: crypto.randomUUID() };
    updatedCards = [...cards, newCard];
  }
  await updateDoc(sectionRef, {
    cards: updatedCards,
    updatedAt: serverTimestamp(),
  });
};

// UPDATE
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

// UPLOAD
export const uploadLogoImage = async (
  clubId: string,
  file: File
): Promise<string> => {
  const fileName = `logo.png`;
  const logoRef = ref(storage, `clubs/${clubId}/public/${fileName}`);
  await deleteObject(logoRef).catch(() => {});
  await uploadBytes(logoRef, file);
  return getDownloadURL(logoRef);
};

export const uploadBannerImage = async (
  clubId: string,
  file: File
): Promise<string> => {
  // Delete all existing banners
  const bannerRef = ref(storage, `clubs/${clubId}/website/banner`);
  const bannerList = await listAll(bannerRef);
  const deletePromises = bannerList.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
  // Upload new banner
  const fileName = `${Date.now()}-${file.name}`;
  const newBannerRef = ref(
    storage,
    `clubs/${clubId}/website/banner/${fileName}`
  );
  await uploadBytes(newBannerRef, file);
  return getDownloadURL(newBannerRef);
};

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

export const uploadCardImage = async (
  websiteId: string,
  sectionId: string,
  file: File
): Promise<string> => {
  // Validate file size/type here if needed
  const fileName = `${Date.now()}-${file.name}`;
  const imageRef = ref(
    storage,
    `clubWebsites/${websiteId}/sections/${sectionId}/cards/${fileName}`
  );
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
};

// DELETE
export const deleteLogoImage = async (clubId: string): Promise<void> => {
  const fileName = `logo.png`;
  const logoRef = ref(storage, `clubs/${clubId}/public/${fileName}`);
  await deleteObject(logoRef).catch(() => {});
};

export const deleteBannerImage = async (clubId: string): Promise<void> => {
  const bannerRef = ref(storage, `clubs/${clubId}/website/banner`);
  const bannerList = await listAll(bannerRef);
  const deletePromises = bannerList.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
};

export const deleteGalleryImage = async (
  clubId: string,
  imageUrl: string,
  imageId: string
): Promise<ClubWebsiteContent | null> => {
  // Remove from storage
  const imageRef = ref(
    storage,
    imageUrl
      .replace(/^https?:\/\/[^/]+\/o\//, "")
      .replace(/\?.*$/, "")
      .replace(/%2F/g, "/")
  );
  await deleteObject(imageRef);
  // Remove from Firestore (localContent update is handled in component)
  const websiteRef = doc(db, "clubWebsites", clubId);
  const websiteDoc = await getDoc(websiteRef);
  if (!websiteDoc.exists()) return null;
  const websiteData = websiteDoc.data() as ClubWebsiteContent;
  const updatedGallery = websiteData.gallery.filter(
    (img) => img.id !== imageId
  );
  await updateDoc(websiteRef, {
    gallery: updatedGallery,
    updatedAt: serverTimestamp(),
  });
  return { ...websiteData, gallery: updatedGallery };
};

// Delete a section (and all its cards)
export const deleteSection = async (websiteId: string, sectionId: string) => {
  const sectionRef = doc(db, `clubWebsites/${websiteId}/sections/${sectionId}`);
  await deleteDoc(sectionRef);
};

// Delete a card from a section
export const deleteCard = async (
  websiteId: string,
  sectionId: string,
  cardId: string
) => {
  const sectionRef = doc(db, `clubWebsites/${websiteId}/sections/${sectionId}`);
  const sectionSnap = await getDoc(sectionRef);
  if (!sectionSnap.exists()) throw new Error("Section not found");
  const section = sectionSnap.data() as ClubWebsiteSection;
  const updatedCards = (section.cards || []).filter(
    (c: ClubWebsiteCard) => c.id !== cardId
  );
  await updateDoc(sectionRef, {
    cards: updatedCards,
    updatedAt: serverTimestamp(),
  });
};

// Reorder sections (update 'order' field for all)
export const reorderSections = async (
  websiteId: string,
  orderedSectionIds: string[]
) => {
  const batch = [] as Promise<void>[];
  orderedSectionIds.forEach((sectionId, idx) => {
    const sectionRef = doc(
      db,
      `clubWebsites/${websiteId}/sections/${sectionId}`
    );
    batch.push(
      updateDoc(sectionRef, { order: idx + 1, updatedAt: serverTimestamp() })
    );
  });
  await Promise.all(batch);
};
