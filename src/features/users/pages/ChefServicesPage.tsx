import { useRef, useState, useTransition } from 'react';
import { useFormik } from 'formik';
import {
  CookingClassAppearance,
  DeliveryOption,
  EatingCoachService,
  MealPrepAppearance,
  ServiceType,
  UserPageProps
} from '../domain/types';
import { chefServiceFormSchema, createChefServiceValidationSchema } from '../domain/validators';
import { extractInitialValues, withZodSchema } from '../../../utils/zodValidator';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import InputField from '../../../app/components/InputField';
import MultiSelectDropdown from '../components/MultiSelectDropDown';
import { CuisineTypeEnum, EventTypeEnum, menuServices } from '../../menus/domain/types.ts';
import { configurableServices, requiresEvents } from '../domain/constants.ts';
import DragAndDropImage from '../components/DragAndDropImage.tsx';
import { useFetchChefServicesQuery } from '../domain/usecase.ts';
import { ChefService } from '../data/model.ts';
import fetch from '../../../app/services/api.ts';
import { formDataFromObject } from '../../../utils/apiUtils.ts';
import { toast } from 'react-toastify';

export default function ChefServicesPage({ user }: UserPageProps) {
  const [services, setServices] = useState<Map<ServiceType, ChefService>>(new Map());
  const [isPending, startTransition] = useTransition();
  const selectedImages = useRef(new Map<ServiceType, string>());

  const { data } = useFetchChefServicesQuery(user.id);

  // Initialize services data
  if (data.length > 0 && services.size === 0) {
    const initialServices = new Map<ServiceType, ChefService>();
    data.forEach((service: ChefService) => {
      initialServices.set(service.chef_service, service);
    });
    setServices(initialServices);
  }

  const handleAvailabilityToggle = async (serviceType: ServiceType, availability: boolean) => {
    try {
      const updatedServices = new Map(services);
      const service = updatedServices.get(serviceType);
      if (service) {
        service.availability = availability;
        updatedServices.set(serviceType, service);
        setServices(updatedServices);
      }
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const handleServiceUpdate = (serviceType: ServiceType, data: ChefService) => {
    const updatedServices = new Map(services);
    updatedServices.set(serviceType, data);
    setServices(updatedServices);
  };

  const handleSaveAll = () => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const actions: Promise<any>[] = [];
        services.forEach((service, serviceType) => {
          const image = selectedImages.current?.get(serviceType);
          if (image) {
            service.cover_image = image;
          }

          const numberFields = Object.keys(chefServiceFormSchema.shape).filter(
            // @ts-expect-error get all fields that are numbers from the schema
            (key) => chefServiceFormSchema.shape[key]?._def.typeName === 'ZodNumber'
          );
          console.log('Number Fields:', numberFields);
          const data: Record<string, any> = {
            ...service
          };
          numberFields.forEach((field) => {
            const value = data[field];
            if (value !== undefined && value !== null) {
              data[field] = Number(value);
            }
          });

          if (!menuServices.includes(serviceType) && service.availability) {
            const result = chefServiceFormSchema.safeParse(data);
            if (result.success) {
              actions.push(
                fetch({
                  url: service.id ? `services/${service.id}/` : 'services/',
                  method: service.id ? 'PATCH' : 'POST',
                  data: formDataFromObject(data),
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
              );
            } else {
              console.error(`Validation failed for ${serviceType}:`, result.error);
              toast(result.error.errors?.[0]?.message, {
                type: 'error'
              });
            }
          }
        });
        await Promise.allSettled(actions);
      } catch (error) {
        console.error('Failed to save services:', error);
      }
    });
  };

  // Service Edit Form Component (inline)
  const ServiceEditForm = ({ serviceType }: { serviceType: ServiceType }) => {
    const service = services.get(serviceType);

    // Create validation schema based on service type
    const conditionalSchema = createChefServiceValidationSchema(serviceType);
    const formik = useFormik<ChefService>({
      initialValues: service || extractInitialValues(chefServiceFormSchema),
      validate: withZodSchema(conditionalSchema),
      onSubmit: (values) => {
        handleServiceUpdate(serviceType, values);
      }
    });

    const needsEvents = requiresEvents(serviceType);

    const handleUpdateImage = (image?: string) => {
      if (image) {
        selectedImages.current?.set(serviceType, image);
      } else {
        selectedImages.current?.delete(serviceType);
      }
    };

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4 pb-4 border-b">
        <ToggleCard
          key={serviceType}
          title={serviceType}
          isOn={service?.availability || false}
          onToggle={() => handleAvailabilityToggle(serviceType, !service?.availability)}
          underline={false}
        />

        <div className="w-[70%] space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Starting Price Per Person"
              name="starting_price_per_person"
              type="text"
              placeholder="50.00"
              value={formik.values.starting_price_per_person}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.starting_price_per_person && formik.errors.starting_price_per_person
              }
            />

            <InputField
              label="Minimum Number of Guests"
              name="min_num_of_guests"
              type="text"
              placeholder="5"
              value={formik.values.min_num_of_guests}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.min_num_of_guests && formik.errors.min_num_of_guests}
            />
          </div>

          {/* Cuisines */}
          <div>
            <MultiSelectDropdown
              title="Cuisine Types"
              options={CuisineTypeEnum.options}
              value={formik.values.cuisines}
              onChange={(e) => formik.setFieldValue('cuisines', e.target.value)}
            />
            {formik.touched.cuisines && formik.errors.cuisines && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.cuisines}</p>
            )}
          </div>

          {/* Events (for specific service types) */}
          {needsEvents && (
            <div>
              <MultiSelectDropdown
                title="Event Types"
                options={EventTypeEnum.options}
                value={formik.values.events}
                onChange={(e) => formik.setFieldValue('events', e.target.value)}
              />
              {formik.touched.events && formik.errors.events && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.events}</p>
              )}
            </div>
          )}

          {/* Service-specific fields */}
          {serviceType === ServiceType.mealPrep && (
            <>
              <div>
                <MultiSelectDropdown
                  title="Appearance"
                  options={Object.values(MealPrepAppearance)}
                  value={formik.values.meal_prep_appearance}
                  onChange={(e) => formik.setFieldValue('meal_prep_appearance', e.target.value)}
                />
                {formik.touched.meal_prep_appearance && formik.errors.meal_prep_appearance && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.meal_prep_appearance as string}
                  </p>
                )}
              </div>

              <div>
                <MultiSelectDropdown
                  title="Delivery Options"
                  options={Object.values(DeliveryOption)}
                  value={formik.values.delivery_option}
                  onChange={(e) => formik.setFieldValue('delivery_option', e.target.value)}
                />
                {formik.touched.delivery_option && formik.errors.delivery_option && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.delivery_option as string}
                  </p>
                )}
              </div>
            </>
          )}

          {serviceType === ServiceType.mealDelivery && (
            <InputField
              label="Delivery Time (hours)"
              name="deliveryTime"
              type="text"
              placeholder="2"
              value={formik.values.deliveryTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.deliveryTime && formik.errors.deliveryTime}
            />
          )}

          {serviceType === ServiceType.cookingClass && (
            <div>
              <MultiSelectDropdown
                title="Class Format"
                options={Object.values(CookingClassAppearance)}
                value={formik.values.cookingClassAppearance}
                onChange={(e) => formik.setFieldValue('cookingClassAppearance', e.target.value)}
              />
              {formik.touched.cookingClassAppearance && formik.errors.cookingClassAppearance && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.cookingClassAppearance as string}
                </p>
              )}
            </div>
          )}

          {serviceType === ServiceType.eatingCoach && (
            <>
              <InputField
                label="Price Per Hour"
                name="price_per_hour"
                type="text"
                placeholder="75.00"
                value={formik.values.price_per_hour}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price_per_hour && formik.errors.price_per_hour}
              />

              <div>
                <MultiSelectDropdown
                  title="Services Offered"
                  options={Object.values(EatingCoachService)}
                  value={formik.values.services}
                  placeholder="Select services"
                  onChange={(e) => formik.setFieldValue('services', e.target.value)}
                />
                {formik.touched.services && formik.errors.services && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.services as string}</p>
                )}
              </div>
            </>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Cover Image
            </label>
            <DragAndDropImage onImageSelected={handleUpdateImage} />
            {formik.touched.cover_image && formik.errors.cover_image && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.cover_image as string}</p>
            )}
          </div>

          {/* Display service-specific validation error */}
          {formik.errors.serviceSpecific && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{formik.errors.serviceSpecific}</p>
            </div>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <UserSettingsTitle title="Services" onSave={handleSaveAll} loading={isPending} />

      <p className="text-xs text-dark-charcoal/50 mb-4">
        Activate the services you are available for and configure your preferences
      </p>

      <div className="space-y-4">
        {menuServices.map((serviceType) => {
          const service = services.get(serviceType);
          return (
            <ToggleCard
              key={serviceType}
              title={serviceType}
              isOn={service?.availability || false}
              onToggle={() => handleAvailabilityToggle(serviceType, !service?.availability)}
              underline={true}
            />
          );
        })}

        {/* Services that need detailed configuration */}
        {configurableServices.map((serviceType) => {
          return <ServiceEditForm key={serviceType} serviceType={serviceType} />;
        })}
      </div>
    </div>
  );
}
