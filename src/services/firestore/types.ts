export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member";
  clubId?: string;
  createdAt: Date;
}

export interface ClubData {
  name: string;
  formattedName: string;
  logoUrl?: string;
  createdBy: string;
  inviteCode: string;
  members: string[];
  createdAt: Date;
}
