import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { UserData } from "./types";

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

export const getMembers = async (clubId: string): Promise<UserData[]> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);
  const clubData = clubDoc.data();

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
  const clubData = clubDoc.data();

  await setDoc(
    clubRef,
    {
      members: [...(clubData?.members || []), userData.email],
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
  const clubData = clubDoc.data();

  await setDoc(
    clubRef,
    {
      members: clubData?.members.filter((id: string) => id !== memberId),
    },
    { merge: true }
  );

  // Update user's clubId to null
  const userRef = doc(db, "users", memberId);
  await setDoc(userRef, { clubId: null }, { merge: true });
};
