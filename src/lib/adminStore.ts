import { allProjects, ProjectData } from './projectsData';
import { blogArticles, BlogArticle } from './blogData';
import { siteConfig } from './config';

export interface AdminSocialPost {
  id: string;
  type: 'instagram' | 'youtube' | 'facebook';
  thumbnail: string;
  title: string;
  caption: string;
  url: string;
  videoUrl?: string;
  status: 'published' | 'draft';
  relatedProject?: string;
  date: string;
}

export interface AdminEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Closed';
  source?: string;
  notes?: string;
}

export interface AdminService {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  status: boolean;
  projectsCount: number;
}

export interface WebsiteSettingsData {
  websiteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  footerDescription: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  businessHours: {
    day: string;
    open: boolean;
    hours: string;
  }[];
}

export const initialSocialPosts: AdminSocialPost[] = [
  {
    id: '#12',
    type: 'instagram',
    thumbnail: '/images/gate_proj_2.jpg',
    title: 'Modern Gate Installation',
    caption: 'Watch our custom-fabricated trackless cantilever sliding gate operating effortlessly in Vijayawada.',
    url: 'https://www.instagram.com/veldexfabrications',
    videoUrl: '/images/gate_sliding_action.mp4',
    status: 'published',
    relatedProject: 'modern-villa-gate',
    date: 'May 12, 2024',
  },
  {
    id: '#11',
    type: 'instagram',
    thumbnail: '/images/stairs.jpg',
    title: 'Spiral Staircase Design',
    caption: 'Step inside this Guntur duplex villa to see how our steel spine monostringer staircase anchors the space.',
    url: 'https://www.instagram.com/veldexfabrications',
    videoUrl: '/images/stairs_showcase_bg.mp4',
    status: 'published',
    relatedProject: 'glass-staircase',
    date: 'May 10, 2024',
  },
  {
    id: '#10',
    type: 'youtube',
    thumbnail: '/images/gazebo.jpg',
    title: 'Rooftop Pergola Timelapse',
    caption: 'Full construction and installation walkthrough of a heavy structural steel rooftop gazebo in Vijayawada.',
    url: 'https://www.youtube.com/@veldexfabrications',
    status: 'published',
    relatedProject: 'rooftop-pergola',
    date: 'May 06, 2024',
  },
  {
    id: '#9',
    type: 'instagram',
    thumbnail: '/images/railings.jpg',
    title: 'Stainless Steel Railing',
    caption: 'Testing the structural rigidity and optical clarity of our frameless glass balcony railings.',
    url: 'https://www.instagram.com/veldexfabrications',
    status: 'draft',
    relatedProject: 'ss-railing',
    date: 'May 02, 2024',
  },
];

export const initialEnquiries: AdminEnquiry[] = [
  {
    id: '#57',
    name: 'Ramesh Babu',
    phone: '+91 9988776655',
    email: 'ramesh.babu@gmail.com',
    service: 'Gate Automation',
    message: 'Need automated laser cut sliding gate for our new villa in Benz Circle, Vijayawada. Width 16ft, height 6ft.',
    date: 'May 16, 2024',
    status: 'New',
    source: 'Website Quote Form',
    notes: 'Called customer, scheduled site visit for Saturday morning.',
  },
  {
    id: '#56',
    name: 'Prasad Varma',
    phone: '+91 9494949494',
    email: 'prasad.varma@outlook.com',
    service: 'Staircase',
    message: 'Looking for a modern steel spine staircase with wooden treads for internal duplex home in Guntur.',
    date: 'May 15, 2024',
    status: 'Contacted',
    source: 'Direct WhatsApp',
    notes: 'Sent preliminary 3D catalog and estimation range.',
  },
  {
    id: '#55',
    name: 'Swathi Kiran',
    phone: '+91 8978543210',
    email: 'swathi.kiran@yahoo.com',
    service: 'Pergola',
    message: 'Terrace rooftop pergola with weatherproof tiles and warm lighting needed in Vijayawada.',
    date: 'May 14, 2024',
    status: 'In Progress',
    source: 'Website Contact Page',
    notes: '3D CAD design approved by architect, fabrication in progress.',
  },
  {
    id: '#54',
    name: 'Kiran Kumar',
    phone: '+91 9123456789',
    email: 'kiran.k@gmail.com',
    service: 'Roofing',
    message: 'Terrace shed covering 1200 sqft for heat reduction. Please send quote for insulated PUF panels.',
    date: 'May 13, 2024',
    status: 'New',
    source: 'Website Quote Form',
    notes: 'Sent quote breakdown via email and WhatsApp.',
  },
  {
    id: '#53',
    name: 'Harish Reddy',
    phone: '+91 9988097799',
    email: 'harish.reddy@gmail.com',
    service: 'Railings',
    message: 'Frameless glass balcony railing with Grade 304 SS handrails, 80 running feet.',
    date: 'May 13, 2024',
    status: 'Completed',
    source: 'Referral',
    notes: 'Installation successfully completed and handed over.',
  },
];

export const initialServices: AdminService[] = [
  {
    id: '#1',
    name: 'Gate Fabrication & Automation',
    slug: 'gate-automation',
    iconName: 'Shield',
    status: true,
    projectsCount: 12,
  },
  {
    id: '#2',
    name: 'Railings & Balustrades',
    slug: 'railings',
    iconName: 'Columns',
    status: true,
    projectsCount: 8,
  },
  {
    id: '#3',
    name: 'Custom Staircases',
    slug: 'staircases',
    iconName: 'TrendingUp',
    status: true,
    projectsCount: 6,
  },
  {
    id: '#4',
    name: 'Pergolas & Gazebos',
    slug: 'pergolas-gazebos',
    iconName: 'Home',
    status: true,
    projectsCount: 5,
  },
  {
    id: '#5',
    name: 'Sheds & Roofing',
    slug: 'sheds-roofing',
    iconName: 'Building',
    status: true,
    projectsCount: 7,
  },
  {
    id: '#6',
    name: 'Elevations & Metalwork',
    slug: 'elevations-facades',
    iconName: 'Grid',
    status: true,
    projectsCount: 4,
  },
];

export const initialSettings: WebsiteSettingsData = {
  websiteName: 'Veldex Fabrications',
  tagline: 'Building Trust. Delivering Excellence.',
  logoUrl: '/images/og-default.jpg',
  faviconUrl: '/favicon.ico',
  footerDescription:
    'Custom metal fabrication specialists in Vijayawada. Precision engineering for gates, railings, staircases, and architectural metalwork.',
  phone: '+91 63050 66077',
  whatsapp: '+91 63050 66077',
  email: 'veldexfabrications@gmail.com',
  address: 'Vijayawada, Andhra Pradesh, India',
  googleMapsUrl: 'https://maps.google.com/?q=Vijayawada,+Andhra+Pradesh',
  instagram: 'https://instagram.com/veldexfabrications',
  facebook: 'https://facebook.com/veldexfabrications',
  youtube: 'https://youtube.com/@veldexfabrications',
  linkedin: 'https://linkedin.com/company/veldexfabrications',
  defaultSeoTitle: 'Veldex Fabrications | Custom Metal Engineering Vijayawada',
  defaultMetaDescription:
    'Custom metal fabrication specialists in Vijayawada for automatic gates, glass railings, spiral staircases, pergolas and roofing.',
  defaultKeywords:
    'metal fabrication, automatic gates, glass railings, spiral staircases, pergolas, vijayawada, andhra pradesh',
  defaultOgImage: '/images/elevation.jpg',
  businessHours: [
    { day: 'Monday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Tuesday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Wednesday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Thursday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Friday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Saturday', open: true, hours: '9:00 AM – 9:00 PM' },
    { day: 'Sunday', open: true, hours: '9:00 AM – 9:00 PM' },
  ],
};
