import type { Timestamp } from "firebase/firestore";

export type Treasury = {
  id: string;
  type: TreasuryType;
  label: string;
  amount: number;
  date: Timestamp;
  category: string;
  documentUrl?: string;
  status: TreasuryStatus;
  clubId: string;
  createdAt: Timestamp;
};

export type TreasuryUpdateInput = {
  type?: TreasuryType;
  label?: string;
  amount?: number;
  date?: Timestamp;
  category?: string;
  documentUrl?: string;
  status?: TreasuryStatus;
};

export enum TreasuryType {
  revenue = "revenue",
  expense = "expense",
}

export enum TreasuryStatus {
  paid = "paid",
  unpaid = "unpaid",
  refund = "refund",
}
