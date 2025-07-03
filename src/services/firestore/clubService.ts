import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { ClubData, InviteData } from "./types/club";

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

export const createClub = async (
  clubData: Omit<ClubData, "createdAt">
): Promise<string> => {
  const clubsRef = collection(db, "clubs");
  const clubId = doc(clubsRef).id;
  const clubRef = doc(db, "clubs", clubId);

  // Prepare club data with initial subscription info
  const clubDataToSave = {
    ...clubData,
    createdAt: serverTimestamp(),
  };

  await setDoc(clubRef, clubDataToSave);

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

export async function createInvite(
  clubId: string,
  invite: Omit<InviteData, "createdAt">
) {
  if (!invite.role) throw new Error("Role is required");
  const inviteId = invite.code;
  const inviteRef = doc(db, `clubs/${clubId}/invites/${inviteId}`);
  // Remove undefined fields
  const inviteToSave = Object.fromEntries(
    Object.entries(invite).filter(([_, v]) => v !== undefined)
  );
  await setDoc(inviteRef, inviteToSave);
  return inviteId;
}

export async function listInvites({ clubId }: { clubId: string }) {
  const invitesRef = collection(db, `clubs/${clubId}/invites`);
  const snapshot = await getDocs(invitesRef);
  return snapshot.docs.map((doc) => doc.data() as InviteData);
}

export async function updateInvite({
  clubId,
  code,
  data,
}: {
  clubId: string;
  code: string;
  data: Partial<InviteData>;
}) {
  const inviteRef = doc(db, `clubs/${clubId}/invites/${code}`);
  await setDoc(inviteRef, data, { merge: true });
}

export async function deleteInvite(clubId: string, code: string) {
  const inviteRef = doc(db, `clubs/${clubId}/invites/${code}`);
  await deleteDoc(inviteRef);
}

export async function revokeInvite(clubId: string, code: string) {
  const inviteRef = doc(db, `clubs/${clubId}/invites/${code}`);
  await setDoc(inviteRef, { status: "revoked" }, { merge: true });
}
