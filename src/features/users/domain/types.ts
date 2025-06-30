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

export enum ServiceType {
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

export enum MealPrepAppearance {
  monthly = 'Monthly',
  weekly = 'Weekly'
}

export enum DeliveryOption {
  physical = 'Physical',
  delivery = 'Delivery'
}

export enum CookingClassAppearance {
  physical = 'Physical',
  virtual = 'Virtual'
}

export enum EatingCoachService {
  mealPlanning = 'Meal Planning',
  nutrition = 'Nutrition',
  weightLoss = 'Weight Loss'
}
