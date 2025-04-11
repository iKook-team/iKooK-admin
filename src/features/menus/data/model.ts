import { User } from '../../users/data/model.ts';

export interface Menu {
  id: number;
  chef: User;
  name: string;
  price_per_person: string;
  currency: string;
  images: string[];
  verifiedAt: string;
  active: boolean;
  status: MenuStatus;
}

export interface MenuDetails {
  chef: User;
  menu_name: string;
  max_menu_selection: number;
  minimum_number_of_guest: number;
  menu_price: number;
  cuisine: string[];
  event: string[];
  images: string[];
  description: string | null;
  search_tags: string[];
  currency: string;
  status: string;
  starter_menu: MenuCategory;
  main_menu: MenuCategory;
  dessert_menu: MenuCategory;
  side_menu: MenuCategory;
  created_at: string;
}

export interface MenuCategory {
  additional_charge: number;
  menu_selection: number;
  menu: {
    _id: string;
    menuName: string;
    description: string;
  }[];
}

export enum MenuStatus {
  active = 'Active',
  draft = 'Draft',
  deleted = 'Deleted',
  pending = 'Pending'
}
