import type { Timestamp } from "firebase/firestore";

export type Training = {
  id?: string;
  type: string;
  coach: string;
  notes: string;
  dateTimeStart: Timestamp;
  cancelled: boolean;
  durationInMin: number;
  recurence: Recurrence;
  groupIds: string[];
};

export type Recurrence = {
  frequency: string;
  until?: Timestamp;
};
