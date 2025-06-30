// Service dropdown options and constants

import { ServiceType } from './types.ts';
import { menuServices } from '../../menus/domain/types.ts';

export const configurableServices = Object.values(ServiceType).filter(
  (e) => e != ServiceType.boxGrocery && menuServices.indexOf(e) == -1
);

// Services that require event selection
export const servicesRequiringEvents: ServiceType[] = [
  ServiceType.largeEvent,
  ServiceType.mealDelivery,
  ServiceType.corporateDining
];

// Helper functions
export const requiresEvents = (serviceType: ServiceType): boolean => {
  return servicesRequiringEvents.includes(serviceType);
};

// Default form values for different service types
export const defaultServiceValues = {
  availability: false,
  startingPricePerPerson: '',
  minNumOfGuests: '1',
  events: [],
  cuisines: [],
  coverImage: undefined,
  mealPrepAppearance: [],
  deliveryOption: [],
  deliveryTime: '',
  cookingClassAppearance: [],
  pricePerHour: '',
  eatingCoachServices: []
};
