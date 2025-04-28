import { FormikProps } from 'formik';

export function getFormikErrorForId<T>(formik: FormikProps<T>, id: string) {
  const error = formik.errors[id as keyof typeof formik.errors];
  return Array.isArray(error) ? (error as string[]).join(', ') : (error as string);
}
