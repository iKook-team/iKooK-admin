import { z } from 'zod';

export interface UpdateMenuStatusRequest {
  menuId: string;
  status: 'approve' | 'unapprove';
  message?: string;
}

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
