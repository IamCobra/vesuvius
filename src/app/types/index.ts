// Shared types for the restaurant application

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface SocialIcon {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface QuickLink {
  name: string;
  href: string;
}

export type PageType = "home" | "menu" | "order";
