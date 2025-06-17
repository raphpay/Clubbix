import {
  collection,
  doc,
  getDoc,
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
  id?: string;
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

export const getMembers = async (clubId: string): Promise<UserData[]> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);
  const clubData = clubDoc.data() as ClubData;

  if (!clubData?.members?.length) {
    return [];
  }

  const members: UserData[] = [];
  for (const memberId of clubData.members) {
    const userRef = doc(db, "users", memberId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<UserData, "id">;
      members.push({ id: memberId, ...userData });
    }
  }

  return members;
};

export const addMember = async (
  clubId: string,
  userData: Omit<UserData, "createdAt">
): Promise<string> => {
  // First create the user profile
  const userRef = doc(db, "users", userData.email);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  });

  // Then add the user to the club's members array
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);
  const clubData = clubDoc.data() as ClubData;

  await setDoc(
    clubRef,
    {
      members: [...(clubData.members || []), userData.email],
    },
    { merge: true }
  );

  return userData.email;
};

export const updateMember = async (
  clubId: string,
  memberId: string,
  userData: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, "users", memberId);
  await setDoc(userRef, userData, { merge: true });
};

export const deleteMember = async (
  clubId: string,
  memberId: string
): Promise<void> => {
  // Remove member from club's members array
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);
  const clubData = clubDoc.data() as ClubData;

  await setDoc(
    clubRef,
    {
      members: clubData.members.filter((id) => id !== memberId),
    },
    { merge: true }
  );

  // Update user's clubId to null
  const userRef = doc(db, "users", memberId);
  await setDoc(userRef, { clubId: null }, { merge: true });
};
