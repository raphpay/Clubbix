export type Club = {
  id?: string;
  name: string;
  inviteCode: string;
  address: string;
  socialAccounts?: SocialAccounts;
  logoPath?: string;
  members?: string[];
};

export type SocialAccounts = {
  facebookUrl?: string;
  instagramUrl?: string;
};

export function generateInviteCode(length: number = 8): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let inviteCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteCode += characters[randomIndex];
  }

  return inviteCode;
}
