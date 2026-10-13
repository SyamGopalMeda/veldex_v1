export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  materials: string[];
  targetKeywords: string[];
  isCoreCandidate: boolean;
  isPublished: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  serviceRef: string;
  shortDescription: string;
  description: string;
  images: string[];
  materialsAvailable: string[];
  finishOptions: string[];
  pricingModel: string;
  tags: string[];
  isCoreCandidate: boolean;
  isAvailable: boolean;
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  serviceCategory: ServiceCategory;
  location: string;
  description?: string;
  shortDescription?: string;
  images: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt?: string;
}

export type ServiceCategory =
  | 'gate-automation'
  | 'railings'
  | 'staircases'
  | 'pergolas-gazebos'
  | 'sheds-roofing'
  | 'elevations-facades'
  | 'custom';

export type EnquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'ESTIMATE_SENT'
  | 'WON'
  | 'CLOSED';

export interface Enquiry {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  serviceRequested: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
  ipHash?: string; // hashed, never raw IP stored
}

export interface SiteSettings {
  displayPhone: string;
  whatsappNumber: string;
  displayEmail: string;
  publicLocation: string;
  operatingHours: string;
  instagramUrl: string;
  threadsUrl: string;
  adminName?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

// SEO metadata helper type
export interface PageSeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}
