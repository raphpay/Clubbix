export type Member = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  role: string;
  paid: boolean;
  documents: {
    certificateUrl?: string;
    photoUrl?: string;
  };
  createdAt: string;
};
