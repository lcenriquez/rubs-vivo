export type PostType = 'dry' | 'composting';

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface PostPhoto {
  url: string;
  isCover: boolean;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  type: PostType;
  location: Location;
  description: string;
  photos: PostPhoto[];
  status: PostStatus;
  author: {
    displayName: string | null;
    email: string | null;
  };
  createdAt?: any;
  updatedAt?: any;
  dryMixture?: string;
  urineSystem?: 'separated' | 'not_separated';
  hasCollectionService?: boolean;
  collectionService?: {
    name?: string;
    website?: string;
  };
  showContactInfo?: boolean;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  isLocationPrivate?: boolean;
} 