import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export interface TreasuryEntry {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: Date;
  memberId: string;
  memberName: string;
  category: string;
  createdAt: Timestamp;
}

export const addTreasuryEntry = async (
  clubId: string,
  entry: Omit<TreasuryEntry, "id" | "createdAt">
): Promise<string> => {
  const treasuryRef = collection(db, `clubs/${clubId}/treasury`);
  const entryRef = doc(treasuryRef);

  await setDoc(entryRef, {
    ...entry,
    createdAt: serverTimestamp(),
  });

  return entryRef.id;
};

export const getTreasuryEntries = async (
  clubId: string,
  filters?: {
    type?: "income" | "expense";
    category?: string;
    memberId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<TreasuryEntry[]> => {
  const treasuryRef = collection(db, `clubs/${clubId}/treasury`);
  let q = query(treasuryRef, orderBy("date", "desc"));

  if (filters) {
    if (filters.type) {
      q = query(q, where("type", "==", filters.type));
    }
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters.memberId) {
      q = query(q, where("memberId", "==", filters.memberId));
    }
    if (filters.startDate) {
      q = query(q, where("date", ">=", filters.startDate));
    }
    if (filters.endDate) {
      q = query(q, where("date", "<=", filters.endDate));
    }
  }

  const querySnapshot = await getDocs(q);
  console.log("querySnapshot", querySnapshot);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
  })) as TreasuryEntry[];
};

export const getTreasurySummary = async (
  clubId: string
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}> => {
  const entries = await getTreasuryEntries(clubId);

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};
