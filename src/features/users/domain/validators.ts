import * as Yup from 'yup';

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

export const chefServicesSchema = Yup.object().shape({
  starting_price: Yup.string()
    .required('Starting price is required')
    .matches(/^\d+$/, 'Starting price must be a number'),

  minimum_number_of_guests: Yup.string()
    .required('Minimum number of guest is required')
    .matches(/^\d+$/, 'Minimum number of guest must be a number'),

  cuisine_type: Yup.string().required('Minimum number of guest is required')
});

export const chefSettingSchema = Yup.object().shape({
  startingPrice: Yup.string()
    .required('Starting price is required')
    .matches(/^\d+$/, 'Starting price must be a number'),

  minNoGuest: Yup.string()
    .required('Minimum number of guest is required')
    .matches(/^\d+$/, 'minimum number of guest must be a number')
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
