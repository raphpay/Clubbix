import {
  collection,
  deleteDoc,
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

  const dataToSave: any = {
    ...entry,
    createdAt: serverTimestamp(),
  };
  if (entry.memberId) dataToSave.memberId = entry.memberId;

  await setDoc(entryRef, dataToSave);
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
  const docs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
  })) as TreasuryEntry[];
  console.log("doc", docs);
  return docs;
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

export const deleteTreasuryEntry = async (clubId: string, entryId: string) => {
  const entryRef = doc(db, `clubs/${clubId}/treasury/${entryId}`);
  await deleteDoc(entryRef);
};
