import { z } from 'zod';
import { ServiceType } from '../../users/domain/types.ts';

export const EventTypeEnum = z.enum(['Naming', 'Wedding', 'Gathering']);

export const CuisineTypeEnum = z.enum([
  'Italian',
  'African',
  'Chinese',
  'Pastries',
  'French',
  'English',
  'Spicy Mediterranean',
  'Pizza'
]);

export const menuServices = [
  ServiceType.chefAtHome,
  ServiceType.fineDining,
  ServiceType.largeEvent,
  ServiceType.corporateDining,
  ServiceType.mealPrep,
  ServiceType.mealDelivery
];
