import { Timestamp } from "firebase/firestore";

export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "treasurer" | "rider" | "coach" | "parent";
  status: "active" | "inactive" | "pending" | "banned";
  ageGroup?: string;
  clubId?: string;
  createdAt: Timestamp;
}
