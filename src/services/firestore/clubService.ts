import {
  collection,
  deleteDoc,
  doc,
  getDoc,
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

// Fetch invite by code across all clubs
export async function getInviteByCode(
  inviteCode: string
): Promise<{ invite: InviteData; clubId: string } | null> {
  const clubsRef = collection(db, "clubs");
  const clubsSnapshot = await getDocs(clubsRef);
  for (const clubDoc of clubsSnapshot.docs) {
    const clubId = clubDoc.id;
    const inviteRef = doc(db, `clubs/${clubId}/invites/${inviteCode}`);
    const inviteSnap = await getDoc(inviteRef);
    if (inviteSnap.exists())
      return { invite: inviteSnap.data() as InviteData, clubId };
  }
  return null;
}

// Validate invite status, expiry, and usage
export function validateInvite(invite: InviteData): {
  valid: boolean;
  error: string | null;
} {
  if (!invite) return { valid: false, error: "Invalid invite code" };
  if (invite.status === "revoked")
    return { valid: false, error: "This invite was revoked" };
  if (invite.status === "expired")
    return { valid: false, error: "This invite code has expired" };
  if (invite.status === "used-up")
    return { valid: false, error: "Invite code has reached its usage limit" };
  if (invite.expiresAt && invite.expiresAt.toDate() < new Date())
    return { valid: false, error: "This invite code has expired" };
  if (invite.maxUses !== undefined && invite.used >= invite.maxUses)
    return { valid: false, error: "Invite code has reached its usage limit" };
  if (invite.status !== "active")
    return { valid: false, error: "Invalid invite code" };
  return { valid: true, error: null };
}
