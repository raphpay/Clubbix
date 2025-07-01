import { Timestamp } from "firebase/firestore";

export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member";
  clubId?: string;
  createdAt: Timestamp;
}
