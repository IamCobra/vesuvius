// Shared types for the restaurant application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  available: boolean;
  variants?: MenuItemVariant[];
}

export interface MenuItemVariant {
  id: string;
  name: string;
  priceChange: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  menuItems: MenuItem[];
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TableAssignment {
  tableId: string;
  seats: number;
  tableNumber: number;
}

export interface Reservation {
  id?: string;
  partySize: number;
  slotStartUtc: Date;
  slotEndUtc: Date;
  customerId: string;
  customer?: Customer;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  tables: TableAssignment[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface QuickLink {
  name: string;
  href: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
  };
}

export type PageType = "home" | "menu" | "reservation" | "contact" | "admin";
