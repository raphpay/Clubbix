import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { sendPasswordReset } from "./authService";
import { UserData } from "./types/user";

export const createUserProfile = async (
  userId: string,
  userData: Omit<UserData, "createdAt" | "status">
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
  userId: string,
  clubId: string,
  userData: Omit<UserData, "createdAt">
): Promise<void> => {
  try {
    // Create the user profile in Firestore
    const userRef = doc(db, "users", userId);
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
        members: [...(clubData?.members || []), userId],
      },
      { merge: true }
    );

    // Send password reset email to the new user
    await sendPasswordReset(userData.email);
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

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, updates, { merge: true });
};

export interface GetMembersQuery {
  clubId: string;
  search?: string;
  filters?: {
    role?: string;
    status?: string;
    ageGroup?: string;
  };
  sort?: {
    field: "firstName" | "createdAt" | "status";
    direction: "asc" | "desc";
  };
  page?: number;
  pageSize?: number;
  lastVisible?: any; // Firestore DocumentSnapshot
}

export interface GetMembersResult {
  members: UserData[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    lastVisible: any;
  };
}

export async function getMembersWithQuery({
  clubId,
  search = "",
  filters = {},
  sort = { field: "createdAt", direction: "desc" },
  page = 1,
  pageSize = 15,
  lastVisible = null,
}: GetMembersQuery): Promise<GetMembersResult> {
  // Get club members array (same as getMembers)
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);
  const clubData = clubDoc.data();

  if (!clubData?.members?.length) {
    return {
      members: [],
      totalCount: 0,
      pageInfo: { hasNextPage: false, hasPrevPage: false, lastVisible: null },
    };
  }

  // Fetch all member documents from /users collection
  const members: UserData[] = [];
  for (const memberId of clubData.members) {
    const userRef = doc(db, "users", memberId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<UserData, "id">;
      members.push({ id: memberId, ...userData });
    }
  }

  // Apply filters in memory
  let filteredMembers = members;
  if (filters.role) {
    filteredMembers = filteredMembers.filter((m) => m.role === filters.role);
  }
  if (filters.status) {
    filteredMembers = filteredMembers.filter(
      (m) => m.status === filters.status
    );
  }
  if (filters.ageGroup) {
    filteredMembers = filteredMembers.filter(
      (m) => m.ageGroup === filters.ageGroup
    );
  }

  // Apply search in memory
  if (search) {
    const s = search.toLowerCase();
    filteredMembers = filteredMembers.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(s) ||
        `${m.lastName} ${m.firstName}`.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s)
    );
  }

  // Apply sorting in memory
  filteredMembers.sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sort.field) {
      case "firstName":
        aValue = a.firstName.toLowerCase();
        bValue = b.firstName.toLowerCase();
        break;
      case "createdAt":
        aValue = a.createdAt?.toDate?.() || new Date(0);
        bValue = b.createdAt?.toDate?.() || new Date(0);
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sort.direction === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalCount = filteredMembers.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  return {
    members: paginatedMembers,
    totalCount,
    pageInfo: {
      hasNextPage: endIndex < totalCount,
      hasPrevPage: page > 1,
      lastVisible: null, // Not used for in-memory pagination
    },
  };
}
