export type Club = {
  id?: string;
  name: string;
  logoUrl: string;
  address: string;
  socials: Socials;
  settings: Settings;
  adminIds: string[];
};

export type Socials = {
  facebook: string;
  instagram: string;
};

export type Settings = {
  allowOnlineRegistration: boolean;
  membershipFee: number;
  requireCertificate: boolean;
};
