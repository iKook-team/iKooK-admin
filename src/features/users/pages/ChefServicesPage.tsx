import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useFormik } from 'formik';
import {
  CookingClassAppearance,
  DeliveryOption,
  EatingCoachService,
  MealPrepAppearance,
  ServiceType,
  UserPageProps,
  UserType
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
import fetch, { queryClient } from '../../../app/services/api.ts';
import { formDataFromObject } from '../../../utils/apiUtils.ts';
import { toast } from 'react-toastify';

// Service Edit Form Component (hoisted to prevent re-creation)
const ServiceEditForm = ({
  serviceType,
  service,
  onServiceUpdate,
  onImageUpdate
}: {
  serviceType: ServiceType;
  service: ChefService | undefined;
  onServiceUpdate: (serviceType: ServiceType, values: ChefService) => void;
  onImageUpdate: (serviceType: ServiceType, image?: string) => void;
}) => {
  // Create validation schema based on service type
  const conditionalSchema = createChefServiceValidationSchema(serviceType);

  // Normalize backend data for formik (convert fields for local form compatibility)
  const getInitialValues = useCallback(() => {
    if (!service) return extractInitialValues(chefServiceFormSchema);

    return {
      ...extractInitialValues(chefServiceFormSchema),
      ...service,
      // Ensure numeric fields are numbers
      starting_price_per_person: service.starting_price_per_person
        ? Number(service.starting_price_per_person)
        : 0,
      min_num_of_guests: service.min_num_of_guests ? Number(service.min_num_of_guests) : 0,
      price_per_hour: service.price_per_hour ? Number(service.price_per_hour) : 0,
      delivery_time_in_hrs: (service as any).delivery_time_in_hrs
        ? Number((service as any).delivery_time_in_hrs)
        : 0,

      // Convert single choice strings from backend to arrays for MultiSelectDropdown
      meal_prep_appearance: Array.isArray(service.meal_prep_appearance)
        ? service.meal_prep_appearance
        : service.meal_prep_appearance
          ? [service.meal_prep_appearance]
          : [],
      delivery_option: Array.isArray(service.delivery_option)
        ? service.delivery_option
        : service.delivery_option
          ? [service.delivery_option]
          : [],
      cooking_class_appearance: Array.isArray((service as any).cooking_class_appearance)
        ? (service as any).cooking_class_appearance
        : (service as any).cooking_class_appearance
          ? [(service as any).cooking_class_appearance]
          : [],
      cuisines: service.cuisines || [],
      events: service.events || [],
      services: service.services || []
    };
  }, [service]);

  const formik = useFormik<ChefService>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validate: withZodSchema(conditionalSchema),
    onSubmit: (values) => {
      onServiceUpdate(serviceType, values);
    }
  });

  // Sync formik values with parent services map only when user makes changes
  // Skip initial render to prevent overwriting loaded data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onServiceUpdate(serviceType, formik.values);
  }, [formik.values, serviceType, onServiceUpdate]);

  const needsEvents = requiresEvents(serviceType);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4 pb-4 border-b">
      <ToggleCard
        key={serviceType}
        title={serviceType}
        isOn={formik.values.availability || false}
        onToggle={() => formik.setFieldValue('availability', !formik.values.availability)}
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
            onChange={(e) => formik.setFieldValue('cuisines', (e.target as any).value)}
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
              onChange={(e) => formik.setFieldValue('events', (e.target as any).value)}
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
                onChange={(e) => formik.setFieldValue('meal_prep_appearance', (e.target as any).value)}
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
                onChange={(e) => formik.setFieldValue('delivery_option', (e.target as any).value)}
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
            name="delivery_time_in_hrs"
            type="text"
            placeholder="2"
            value={(formik.values as any).delivery_time_in_hrs}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              (formik.touched as any).delivery_time_in_hrs &&
              (formik.errors as any).delivery_time_in_hrs
            }
          />
        )}

        {serviceType === ServiceType.cookingClass && (
          <div>
            <MultiSelectDropdown
              title="Class Format"
              options={Object.values(CookingClassAppearance)}
              value={(formik.values as any).cooking_class_appearance}
              onChange={(e) =>
                formik.setFieldValue('cooking_class_appearance', (e.target as any).value)
              }
            />
            {(formik.touched as any).cooking_class_appearance &&
              (formik.errors as any).cooking_class_appearance && (
                <p className="mt-1 text-sm text-red-600">
                  {(formik.errors as any).cooking_class_appearance as string}
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
                onChange={(e) => formik.setFieldValue('services', (e.target as any).value)}
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
          <DragAndDropImage
            initialImage={formik.values.cover_image}
            onImageSelected={(img) => onImageUpdate(serviceType, img)}
          />
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

export default function ChefServicesPage({ user }: UserPageProps) {
  const [services, setServices] = useState<Map<ServiceType, ChefService>>(new Map());
  const [isPending, startTransition] = useTransition();
  const [isInitialized, setIsInitialized] = useState(false);
  const selectedImages = useRef(new Map<ServiceType, string>());

  const { data, isLoading } = useFetchChefServicesQuery(user.id);

  // Initialize services data from backend
  useEffect(() => {
    if (data && data.length > 0 && !isInitialized) {
      console.log('ChefServicesPage: Loaded data from backend:', data);
      const initialServices = new Map<ServiceType, ChefService>();
      data.forEach((service: ChefService) => {
        // Ensure chef is an ID, not an object
        const normalizedService = {
          ...service,
          chef: typeof service.chef === 'object' ? service.chef.id : (service.chef as any)
        } as ChefService;
        initialServices.set(normalizedService.chef_service, normalizedService);
      });
      setServices(initialServices);
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  const handleAvailabilityToggle = useCallback(
    (serviceType: ServiceType, availability: boolean) => {
      setServices((prev) => {
        const next = new Map(prev);
        const service = next.get(serviceType) || ({
          chef_service: serviceType,
          availability: false,
          chef: user.id
        } as ChefService);

        next.set(serviceType, { ...service, availability });
        return next;
      });
    },
    [user.id]
  );

  const handleServiceUpdate = useCallback(
    (serviceType: ServiceType, values: ChefService) => {
      setServices((prev) => {
        const current = prev.get(serviceType);
        if (JSON.stringify(current) === JSON.stringify(values)) return prev;

        const next = new Map(prev);
        next.set(serviceType, { ...values, chef: user.id, chef_service: serviceType });
        return next;
      });
    },
    [user.id]
  );

  const handleSaveAll = () => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const actions: Promise<any>[] = [];
        // We use current services state
        services.forEach((service, serviceType) => {
          // Find existing ID from data if not in service object
          const existingId = service.id || data?.find(s => s.chef_service === serviceType)?.id;
          
          const image = selectedImages.current?.get(serviceType);
          const dataToSave = { ...service };
          if (image) {
            dataToSave.cover_image = image;
          }

          // Always save if the service exists or if it's being enabled
          if (existingId || service.availability) {
            const isMenuService = menuServices.includes(serviceType);
            const shouldValidate = !isMenuService && service.availability;
            
            // Basic number field conversion for Zod validation
            const validatedData = { ...dataToSave };
            const numberFields = [
              'starting_price_per_person',
              'min_num_of_guests',
              'price_per_hour',
              'delivery_time_in_hrs'
            ];
            numberFields.forEach((field) => {
              if (validatedData[field] !== undefined && validatedData[field] !== '') {
                validatedData[field] = Number(validatedData[field]);
              }
            });

            const result = shouldValidate
              ? chefServiceFormSchema.safeParse(validatedData)
              : { success: true };

            if (result.success) {
              // Final data prep for backend (convert arrays back to single choices if needed)
              const finalData = { ...validatedData };
              const singleChoiceFields = [
                'meal_prep_appearance',
                'delivery_option',
                'cooking_class_appearance'
              ];
              singleChoiceFields.forEach((field) => {
                if (Array.isArray(finalData[field])) {
                  finalData[field] = finalData[field][0] || '';
                }
              });

              // Admin should only update/create with availability and identifiers
              // as per user request: "admin payload should only include availability"
              const payload = existingId
                ? { availability: finalData.availability }
                : {
                    availability: finalData.availability,
                    chef: finalData.chef,
                    chef_service: finalData.chef_service
                  };

              actions.push(
                fetch({
                  url: existingId ? `/services/${existingId}/` : '/services/',
                  method: existingId ? 'PATCH' : 'POST',
                  data: formDataFromObject(payload),
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
              );
            } else if (!isMenuService) {
              console.error(`Validation failed for ${serviceType}:`, (result as any).error);
              toast(`${serviceType}: ${(result as any).error.errors?.[0]?.message}`, {
                type: 'error'
              });
            }
          }
        });

        if (actions.length > 0) {
          const results = await Promise.allSettled(actions);
          const allSuccess = results.every((r) => r.status === 'fulfilled');
          if (allSuccess) {
            toast('Services updated successfully', { type: 'success' });
            // Refresh data
            void queryClient.invalidateQueries({ queryKey: [UserType.chef, user.id, 'services'] });
          } else {
            toast('Some services failed to update', { type: 'warning' });
          }
        }
      } catch (error) {
        console.error('Failed to save services:', error);
        toast('Failed to save services', { type: 'error' });
      }
    });
  };

  const handleImageUpdate = useCallback((serviceType: ServiceType, image?: string) => {
    if (image) {
      selectedImages.current?.set(serviceType, image);
    } else {
      selectedImages.current?.delete(serviceType);
    }
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading services...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <UserSettingsTitle title="Services" onSave={handleSaveAll} loading={isPending} />

      <p className="text-xs text-dark-charcoal/50 mb-4">
        Activate the services you are available for and configure your preferences
      </p>

      <div className="space-y-4">
        {/* Commenting out menu services for now
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
        */}

        {/* Services that need detailed configuration */}
        {configurableServices.map((serviceType) => {
          // Only show Cooking Class and Eating Coach services
          if (
            serviceType !== ServiceType.cookingClass &&
            serviceType !== ServiceType.eatingCoach
          ) {
            return null;
          }

          return (
            <ServiceEditForm
              key={serviceType}
              serviceType={serviceType}
              service={services.get(serviceType)}
              onServiceUpdate={handleServiceUpdate}
              onImageUpdate={handleImageUpdate}
            />
          );
        })}
      </div>
    </div>
  );
}
