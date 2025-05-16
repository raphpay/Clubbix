import type { WebsitePage } from "./WebsitePage";

export type Club = {
  id?: string;
  name: string;
  description: string;
  logoPath?: string;
  address: string;
  socials: Socials;
  settings?: Settings;
  adminIds?: string[];
  websitePage?: WebsitePage;
};

export type Socials = {
  facebook: string;
  instagram: string;
};

export type Settings = {
  allowOnlineRegistration?: boolean;
  membershipFee?: number;
  requireCertificate?: boolean;
};
