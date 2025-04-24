import { User } from '../data/model.ts';

export enum UserType {
  chef = 'Chef',
  host = 'Host',
  admin = 'Admin'
}

export enum UserHeaderTab {
  profile = 'profile',
  account = 'account',
  password = 'password',
  notification = 'notification',
  services = 'services',
  verification = 'verification',
  settings = 'settings'
}

export interface UserPageProps {
  user: User;
  type: UserType;
  className?: string;
}

export enum ChefService {
  chefAtHome = 'Chef at Home',
  cookingClass = 'Cooking Class',
  mealDelivery = 'Meal Delivery',
  largeEvent = 'Large Event',
  mealPrep = 'Meal Prep',
  fineDining = 'Fine Dining',
  corporateDining = 'Corporate Dining',
  boxGrocery = 'Box Grocery',
  eatingCoach = 'Eating Coach'
}
