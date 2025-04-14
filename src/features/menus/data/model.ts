import { User } from '../../users/data/model.ts';

export interface Menu {
  id: number;
  name: string;
  price_per_person: number;
  num_of_guests: number;
  max_menu_selection: number;
  currency: string;
  verifiedAt: string;
  active: boolean;
  event_types: string[];
  cuisine_types: string[];
  menu_type: string;
  courses: MenuCourse[];
  courses_selection_limit: Record<MenuCourse, number>;
  courses_extra_charge_per_person: Record<MenuCourse, number>;
  status: MenuStatus;
  images: MenuImage[];
  items: MenuItem[];
  chef: User;
}

export interface MenuImage {
  id: number;
  image: string;
  menu: number;
}

export interface MenuItem {
  id: number;
  course: MenuCourse;
  name: string;
  description: string;
  menu: number;
}

export enum MenuStatus {
  active = 'Active',
  draft = 'Draft',
  deleted = 'Deleted',
  pending = 'Pending'
}

export enum MenuCourse {
  starter = 'Starter',
  main = 'Main',
  dessert = 'Dessert',
  side = 'Side'
}
