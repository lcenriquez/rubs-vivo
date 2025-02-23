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
  createdAt: Date;
  updatedAt: Date;
} 