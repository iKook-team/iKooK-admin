import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import InputField, { InputContainer } from '../../app/components/InputField';
import MultiSelectDropdown from '../users/components/MultiSelectDropDown';
import UserSettingsTitle from '../users/components/UserSettingsTitle';
import { chefProfileSchema } from '../users/domain/validators';
import { newMenuFields } from './domain/fields';
export default function NewMenu() {
  const fields = newMenuFields;
  const [editing, setEditing] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  async function saveProfileChange(values: any) {
    if (editing === true) {
      return;
    }
    try {
      setEditing(true);
    } finally {
      setEditing(false);
    }
  }

  const onSave = async () => {
    await formik.validateForm();
    if (formik.isValid) {
      formik.handleSubmit();
    } else {
      Object.keys(formik.errors).forEach((key) => {
        toast(formik.errors[key as keyof typeof formik.errors], { type: 'error' });
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      brief_desc: '',
      country: '',
      brief_profile: '',
      date_of_birth: '',
      state: '',
      city: '',
      postcode: '',
      experience: '',
      cuisines: selectedCuisines,
      events: [],
      weekly_charges: 0,
      monthly_charges: 0
    },
    validationSchema: chefProfileSchema,
    onSubmit: (values) => saveProfileChange(values)
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <UserSettingsTitle title="New Menu" onSave={onSave} />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4 w-full lg:w-[90%] self-start"
      >

        {fields.map((field) => {
          return (
            <InputField
              key={field.id}
              label={field.label}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              onChange={formik.handleChange}
              className={`mb-4 ${field.hidden ? 'hidden' : ''}`}
              value={formik.values[field.id as keyof typeof formik.values]}
              onBlur={formik.handleBlur}
              error={
                formik.touched[field.id as keyof typeof formik.touched] &&
                formik.errors[field.id as keyof typeof formik.errors]
                  ? Array.isArray(formik.errors[field.id as keyof typeof formik.errors])
                    ? (formik.errors[field.id as keyof typeof formik.errors] as string[]).join(', ')
                    : (formik.errors[field.id as keyof typeof formik.errors] as string)
                  : undefined
              }
            />
          );
        })}
        <div>
          <InputContainer
            error={
              formik.touched.cuisines && formik.errors.cuisines
                ? Array.isArray(formik.errors.cuisines)
                  ? formik.errors.cuisines.join(', ')
                  : formik.errors.cuisines
                : undefined
            }
          >
            <MultiSelectDropdown
              onChange={setSelectedEvents}
              title="Events avaliable for"
              options={['Wedding', 'birthday', 'Party']}
              value={selectedEvents}
            />
          </InputContainer>
        </div>
        <div>
          <InputContainer
            error={
              formik.touched.cuisines && formik.errors.cuisines
                ? Array.isArray(formik.errors.cuisines)
                  ? formik.errors.cuisines.join(', ')
                  : formik.errors.cuisines
                : undefined
            }
          >
            <MultiSelectDropdown
              title="cuisine type"
              options={['African', 'Modern English', 'Italian', 'Chinese', 'Mexican', 'Indian']}
              value={selectedCuisines}
              onChange={setSelectedCuisines}
            />
          </InputContainer>
        </div>
        <div>
          <InputContainer
            error={
              formik.touched.cuisines && formik.errors.cuisines
                ? Array.isArray(formik.errors.cuisines)
                  ? formik.errors.cuisines.join(', ')
                  : formik.errors.cuisines
                : undefined
            }
          >
            <MultiSelectDropdown
              onChange={setSelectedEvents}
              title="Menu type"
              options={['Chef at home', 'Home delivery', 'banqyet']}
              value={selectedEvents}
            />
          </InputContainer>
        </div>
      </form>
    </div>
  );
}
