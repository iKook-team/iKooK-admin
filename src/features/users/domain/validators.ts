import * as Yup from 'yup';

export const chefAccountSchema = Yup.object().shape({
  billingAddress: Yup.string().required('Billing address is required'),
  city: Yup.string().required('City is required'),
  postcode: Yup.string()
    .required('Postcode is required')
    .matches(/^\d+$/, 'Postcode must be a number'),
  bank: Yup.string().required('Bank selection is required'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^\d+$/, 'Account number must be numeric'),
  ibanCode: Yup.string()
    .required('Iban code is required')
    .matches(/^\d+$/, 'Iban code must be numeric'),
  sortCode: Yup.string().required('Sort code is required')
});

export const chefServicesSchema = Yup.object().shape({
  startingPrice: Yup.string()
    .required('Starting price is required')
    .matches(/^\d+$/, 'Starting price must be a number'),

  minNoGuest: Yup.string()
    .required('Minimum number of guest is required')
    .matches(/^\d+$/, 'minimum number of guest must be a number')
});

export const chefSettingSchema = Yup.object().shape({
  startingPrice: Yup.string()
    .required('Starting price is required')
    .matches(/^\d+$/, 'Starting price must be a number'),

  minNoGuest: Yup.string()
    .required('Minimum number of guest is required')
    .matches(/^\d+$/, 'minimum number of guest must be a number')
});
