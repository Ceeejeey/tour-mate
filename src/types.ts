export type Role = 'tourist' | 'guide' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  nationality?: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
}

export interface Guide extends User {
  languages: string[];
  experience: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  isAvailable: boolean;
  serviceArea: string;
  bio: string;
  verified: boolean;
  latitude?: number;
  longitude?: number;
  phone?: string;
}

export interface Booking {
  id: string;
  touristId: string;
  guideId: string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  isReviewed?: boolean;
  totalPrice: number;
  notes?: string;
  guide?: {
    id: string;
    name: string;
    avatar?: string;
    serviceArea?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  };
  tourist?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  method: string;
}

export interface Review {
  id: string;
  bookingId: string;
  guideId: string;
  touristId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  touristId: string;
  guideId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  date: string;
}
