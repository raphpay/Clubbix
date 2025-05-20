import type { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  email: string;
  role: "admin" | "member";
  createdAt?: Timestamp;
  clubId: string;
  firstName: string;
  lastName: string;
};
