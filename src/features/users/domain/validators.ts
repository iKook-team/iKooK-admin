import * as Yup from 'yup';
import { z } from 'zod';
import {
  CookingClassAppearance,
  DeliveryOption,
  EatingCoachService,
  MealPrepAppearance,
  ServiceType
} from './types';

export const chefAccountSchema = Yup.object().shape({
  billing_address: Yup.string().required('Billing address is required'),
  city: Yup.string().required('City is required'),
  postcode: Yup.string()
    .required('Postcode is required')
    .matches(/^\d+$/, 'Postcode must be a number'),
  bank: Yup.string().required('Bank selection is required'),
  account_number: Yup.string()
    .required('Account number is required')
    .matches(/^\d+$/, 'Account number must be numeric'),
  iban_code: Yup.string()
    .required('Iban code is required')
    .matches(/^\d+$/, 'Iban code must be numeric'),
  sort_code: Yup.string().required('Sort code is required')
});

export const adminProfileSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  phone_number: Yup.string()
    .matches(/^\+?[0-9\s]+$/, 'Invalid phone number')
    .required('Phone number is required')
});

export const userProfileSchema = adminProfileSchema.shape({
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required')
});

export const newChefProfileSchema = userProfileSchema.shape({
  address: Yup.string().required('Address is required'),
  postal_code: Yup.string().required('Post Code is required'),
  service_type: Yup.string().required('Service type is required'),
  chef_services: Yup.array().of(Yup.string()).required('Chef services are required')
});

export const chefProfileSchema = newChefProfileSchema.shape({
  cuisines: Yup.array().of(Yup.string()),
  date_of_birth: Yup.string().required('Date of birth is required')
});

export const chefServiceFormSchema = z.object({
  availability: z.boolean().default(false),
  starting_price_per_person: z.number().min(1, 'Starting price is required'),
  min_num_of_guests: z.number().min(1, 'Minimum number of guests is required'),
  cuisines: z.array(z.string()).min(1, 'Please select at least one cuisine type'),
  events: z.array(z.string()).default([]),
  cover_image: z.string().optional(),
  meal_prep_appearance: z.array(z.nativeEnum(MealPrepAppearance)).default([]),
  delivery_option: z.array(z.nativeEnum(DeliveryOption)).default([]),
  deliveryTime: z.string().default(''),
  cookingClassAppearance: z.array(z.nativeEnum(CookingClassAppearance)).default([]),
  price_per_hour: z.number().default(0),
  services: z.array(z.nativeEnum(EatingCoachService)).default([])
});

// Conditional validation based on service type
export const createChefServiceValidationSchema = (serviceType: ServiceType) => {
  return chefServiceFormSchema.refine(
    (data) => {
      // Validate price per hour for eating coach service
      if (serviceType === ServiceType.eatingCoach && !isFinite(Number(data.price_per_hour))) {
        return false;
      }

      return true;
    },
    {
      message: 'Please fill in all required fields for this service type',
      path: ['serviceSpecific']
    }
  );
};
