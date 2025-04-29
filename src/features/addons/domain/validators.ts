import { z } from 'zod';
import { AddonClientStatus, AddonServiceStatus } from '../data/model.ts';

export const createAddonClientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  business_name: z.string().min(1, 'Business name is required'),
  postal_code: z.string().optional(),
  status: z.enum(Object.values(AddonClientStatus) as any).default(AddonClientStatus.verified)
});

export const createAddonServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  status: z.enum(Object.values(AddonServiceStatus) as any).default(AddonServiceStatus.active),
  client: z.number().int().min(0, 'Client ID must be a non-negative integer')
});
