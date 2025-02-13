import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { UserPageProps } from '../domain/types';
import { chefServiceFields, chefServicesInitials } from '../domain/fields';
import InputField from '../../../app/components/InputField';
import { useFormik } from 'formik';
import { chefServicesSchema } from '../domain/validators';
import MultiSelectDropdown from '../components/MultiSelectDropDown';

export default function UserServicesPage({ user }: UserPageProps) {
  console.log(user);
  const [isCah, setIsCat] = useState(false);
  const [isLe, SetIsLe] = useState(false);
  const [isMp, setIsMp] = useState(false);
  const [isCc, setIsCc] = useState(false);
  const [isGd, setIsGd] = useState(false);
  const [isBg, setIsBG] = useState(false);
  const [cuisines, setCuisines] = useState(user.cuisines);

  const fields = chefServiceFields;
  const startingPrice = useMemo(
    () => fields.find((field) => field.id === 'starting_price')!,
    [fields]
  );
  const minGuest = useMemo(
    () => fields.find((field) => field.id === 'minimum_number_of_guests')!,
    [fields]
  );
  const formik = useFormik({
    initialValues: chefServicesInitials,
    validationSchema: chefServicesSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values); // where I will call save changes api
    }
  });

  return (
    <div className="flex flex-col gap-2">
      <UserSettingsTitle title={'Profile'} onSave={() => {}} />
      <h1 className="text-lg text-gray-400">
        Activate the services you are avaliable for and activate your preference
      </h1>

      <ToggleCard
        title={'Chef at Home'}
        isOn={isCah}
        onToggle={() => {
          setIsCat(!isCah);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Large Event'}
        isOn={isLe}
        onToggle={() => {
          SetIsLe(!isLe);
        }}
        underline={false}
      />

      <div className="flex flex-row gap-4 w-[70%]">
        <div className="flex-1">
          <InputField
            key={startingPrice.id}
            label={startingPrice.label}
            name={startingPrice.id}
            type={startingPrice.type}
            placeholder={startingPrice.placeholder}
            onChange={formik.handleChange}
            className={`mb-4 ${startingPrice.hidden ? 'hidden' : ''}`}
            value={formik.values.starting_price} // ✅ Corrected value binding
            onBlur={formik.handleBlur} // ✅ Handles input blur events
            error={
              formik.touched[startingPrice.id as keyof typeof formik.touched] &&
              formik.errors[startingPrice.id as keyof typeof formik.errors]
                ? formik.errors[startingPrice.id as keyof typeof formik.errors]
                : undefined
            }
          />
        </div>
        <div className="flex-1">
          <InputField
            key={minGuest.id}
            label={minGuest.label}
            name={minGuest.id}
            type={minGuest.type}
            placeholder={minGuest.placeholder}
            onChange={formik.handleChange}
            className={`mb-4 ${minGuest.hidden ? 'hidden' : ''}`}
            value={formik.values.minimum_number_of_guests} // ✅ Corrected value binding
            onBlur={formik.handleBlur} // ✅ Handles input blur events
            error={
              formik.touched[minGuest.id as keyof typeof formik.touched] &&
              formik.errors[minGuest.id as keyof typeof formik.errors]
                ? formik.errors[minGuest.id as keyof typeof formik.errors]
                : undefined
            }
          />
        </div>
      </div>

      <div className="flex-1 w-[70%] my-5 ">
        <MultiSelectDropdown
          title={'Cuisine type'}
          options={['African', 'Modern English', 'Italian', 'Chinese', 'Mexican', 'Indian']}
          onChange={setCuisines}
          value={cuisines}
        />
      </div>

      <ToggleCard
        title={'Meal Prep'}
        isOn={isMp}
        onToggle={() => {
          setIsMp(!isMp);
        }}
        underline={true}
        topline={true}
      />

      <ToggleCard
        title={'Cooking Class'}
        isOn={isCc}
        onToggle={() => {
          setIsCc(!isCc);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Gouremt Delivery'}
        isOn={isGd}
        onToggle={() => {
          setIsGd(!isGd);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Boxed Groceries'}
        isOn={isBg}
        onToggle={() => {
          setIsBG(!isBg);
        }}
        underline={false}
      />
    </div>
  );
}
