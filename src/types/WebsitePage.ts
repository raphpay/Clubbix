export type WebsitePage = {
  id?: string;
  clubId: string;
  title: string;
  description: string;
  activities: Activity[];
  pricing: PricingPlan[];
  teamMembers: string[];
  ridersShowcase: RiderShowcase[];
  contact: Contact;
  heroImagePath?: string;
};

export type Activity = {
  icon: string;
  title: string;
  description: string;
};

export type PricingPlan = {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
};

export type RiderShowcase = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export type Contact = {
  email: string;
  phone: string;
  socials: {
    instagram: string;
    facebook: string;
  };
};
