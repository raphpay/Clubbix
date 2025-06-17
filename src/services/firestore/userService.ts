import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { createAuthUser, sendPasswordReset } from "./authService";
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
  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create the user in Firebase Auth
    const authUser = await createAuthUser(userData.email, tempPassword);

    // Create the user profile in Firestore
    const userRef = doc(db, "users", authUser.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });

    // Add the user to the club's members array
    const clubRef = doc(db, "clubs", clubId);
    const clubDoc = await getDoc(clubRef);
    const clubData = clubDoc.data();

    await setDoc(
      clubRef,
      {
        members: [...(clubData?.members || []), authUser.uid],
      },
      { merge: true }
    );

    // Send password reset email to the new user
    await sendPasswordReset(userData.email);

    return authUser.uid;
  } catch (error: any) {
    if (error.message === "Email already in use") {
      // If the user already exists, just add them to the club
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
    }
    throw error;
  }
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
