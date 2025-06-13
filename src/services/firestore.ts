import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import { db, storage } from "../config/firebase";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member";
  clubId?: string;
  createdAt: Date;
}

export interface ClubData {
  name: string;
  formattedName: string;
  logoUrl?: string;
  createdBy: string;
  inviteCode: string;
  members: string[];
  createdAt: Date;
}

export const generateInviteCode = () => {
  return nanoid(8).toUpperCase();
};

export const uploadClubLogo = async (
  clubName: string,
  file: File
): Promise<string> => {
  const fileNameWithDate = `${Date.now()}-${file.name}`;
  const storageRef = ref(
    storage,
    `clubs/logos/${clubName}/${fileNameWithDate}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const checkClubNameExists = async (
  clubName: string
): Promise<boolean> => {
  const clubsRef = collection(db, "clubs");
  const formattedName = clubName.toLowerCase().replace(/\s+/g, "-");
  const q = query(clubsRef, where("formattedName", "==", formattedName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const createUserProfile = async (
  userId: string,
  userData: Omit<UserData, "createdAt">
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

export const createClub = async (
  clubData: Omit<ClubData, "createdAt">
): Promise<string> => {
  const clubsRef = collection(db, "clubs");
  const clubId = doc(clubsRef).id;
  const clubRef = doc(db, "clubs", clubId);

  await setDoc(clubRef, {
    ...clubData,
    createdAt: serverTimestamp(),
  });

  return clubId;
};

export const joinClub = async (
  userId: string,
  inviteCode: string
): Promise<string> => {
  const clubsRef = collection(db, "clubs");
  const q = query(clubsRef, where("inviteCode", "==", inviteCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Invalid invite code");
  }

  const clubDoc = querySnapshot.docs[0];
  const clubId = clubDoc.id;
  const clubData = clubDoc.data() as ClubData;

  // Update club members
  await setDoc(
    doc(db, "clubs", clubId),
    {
      members: [...clubData.members, userId],
    },
    { merge: true }
  );

  // Update user profile with club ID
  await setDoc(
    doc(db, "users", userId),
    {
      clubId,
    },
    { merge: true }
  );

  return clubId;
};
