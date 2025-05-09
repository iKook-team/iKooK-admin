import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { extractInitialValues, withZodSchema } from '../../utils/zodValidator.ts';
import {
  createMenuEntriesSchema,
  createMenuEntrySchema,
  createMenuSchema,
  menuItemSchema
} from './domain/schema.ts';
import { z } from 'zod';
import FormField from '../../app/components/FormField.tsx';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import { Fragment, useCallback, useMemo, useRef, useState, useTransition } from 'react';
import { createMenuEntryFields, createMenuFields, createMenuItemsFields } from './domain/fields';
import { getImageUrl } from '../../utils/getImageUrl.ts';
import { getFormikErrorForId } from '../../utils/formik.ts';
import { DragAndDropImageContainer } from '../users/components/DragAndDropImage.tsx';
import { MenuImage as MenuImageType } from './data/model.ts';
import MenuImage from './components/MenuImage.tsx';
import { useMutation } from '@tanstack/react-query';
import fetch from '../../app/services/api.ts';
import SearchUsersModal from '../users/components/SearchUsersModal.tsx';
import { getCurrentFromRef } from '../../utils/ref.ts';
import { UserType } from '../users/domain/types.ts';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { isDev } from '../../app/environment.ts';

const combinedSchema = createMenuSchema.merge(createMenuEntriesSchema);
const numberOfImages = isDev() ? 1 : 5;
type FormValues = z.infer<typeof combinedSchema>;

export default function CreateMenuScreen() {
  const [page, setPage] = useState(0);
  const [images, setImages] = useState<MenuImageType[]>([]);

  const selectUserModal = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  const createMenuMutation = useMutation({
    mutationFn: (data: FormValues) => {
      return fetch({
        url: `/users/admins/create-menu/`,
        method: 'POST',
        data
      });
    }
  });

  // Create a complete initial values structure
  const initialValues = useMemo(() => {
    const baseValues = extractInitialValues(combinedSchema);
    return {
      ...baseValues,
      courses: baseValues.courses || [],
      entries: baseValues.entries || {}
    };
  }, []);

  // Configure formik with the complete schema
  const formik = useFormik<FormValues>({
    validateOnMount: false,
    initialValues,
    validate: (values) => {
      // Only validate the current page's schema
      const currentSchema = page === 0 ? createMenuSchema : createMenuEntriesSchema;

      return withZodSchema(currentSchema)(values);
    },
    onSubmit: async (values) => {
      if (isPending) {
        return;
      }
      const { entries, ...data } = values;
      startTransition(async () => {
        try {
          const body = {
            ...data,
            courses_extra_charge_per_person: Object.keys(entries).reduce(
              (acc, course) => {
                const entry = entries[course as keyof typeof entries];
                if (entry && entry.extra_charge_per_person) {
                  acc[course] = entry.extra_charge_per_person;
                }
                return acc;
              },
              {} as Record<string, number>
            ),
            courses_selection_limit: Object.keys(entries).reduce(
              (acc, course) => {
                const entry = entries[course as keyof typeof entries];
                if (entry && entry.selection_limit) {
                  acc[course] = entry.selection_limit;
                }
                return acc;
              },
              {} as Record<string, number>
            )
          };
          console.log(body);
          const response = await createMenuMutation.mutateAsync(body);
        } catch (_) {
          // do nothing
        }
      });
    }
  });

  // Get the current course based on page number
  const getCurrentCourse = () => {
    if (page === 0 || !formik.values.courses) return null;
    return formik.values.courses[page - 1];
  };

  const currentCourse = getCurrentCourse();

  // Handle back button click
  const onBack = useCallback(() => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Handle continue button click
  const onContinue = async () => {
    // For the first page, validate the base menu data
    if (page === 0) {
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        const firstError = Object.keys(errors)[0];
        toast.error(`Error in field ${firstError}: ${errors[firstError]}`);
        return;
      }

      // If we have no courses, we can't continue
      if (!formik.values.courses || formik.values.courses.length === 0) {
        toast.error('Please select at least one course');
        return;
      }

      // Move to the first course page
      setPage(1);
      return;
    }

    // For course pages, validate the current course entry
    if (currentCourse) {
      // Initialize the current course entry if it doesn't exist
      if (!formik.values.entries[currentCourse]) {
        formik.setFieldValue(`entries.${currentCourse}`, {
          selection_limit: 1,
          extra_charge_per_person: 0,
          items: []
        });
      }

      // Validate just the current course entry
      const courseSchema = z.object({
        entries: z.object({
          [currentCourse]: createMenuEntrySchema
        })
      });

      try {
        console.log(formik.values);
        courseSchema.parse(formik.values);

        // If we have more courses to show, move to the next one
        if (page < formik.values.courses.length) {
          setPage(page + 1);
        } else {
          // Otherwise, we're done with all courses, move to final page (images)
          setPage(formik.values.courses.length + 1);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors;
          const errorPath = Object.keys(fieldErrors)[0];
          const errorMessage = fieldErrors[errorPath]?.[0];
          toast.error(errorMessage || 'Please fix the errors before continuing');
        } else {
          toast.error('An error occurred while validating the form');
        }
      }
      return;
    } else if (images.length < numberOfImages) {
      toast.error(`Please upload at least ${numberOfImages} images`);
      return;
    }

    // Last page (images) - submit the form
    formik.handleSubmit();
  };

  // Handle adding a new menu item to the current course
  const addMenuItem = useCallback(() => {
    if (!currentCourse) return;

    const currentEntries = formik.values.entries || {};
    const currentCourseEntry = currentEntries[currentCourse] || { items: [] };
    const updatedItems = [
      ...(currentCourseEntry.items || []),
      { name: '', description: '', course: currentCourse, menu: null }
    ];

    formik.setFieldValue(`entries.${currentCourse}.items`, updatedItems);
  }, [currentCourse, formik]);

  // Handle removing a menu item from the current course
  const removeMenuItem = useCallback(
    (index: number) => {
      if (!currentCourse) return;

      const currentEntries = formik.values.entries || {};
      const currentCourseEntry = currentEntries[currentCourse] || { items: [] };
      const updatedItems = currentCourseEntry.items.filter((_, i) => i !== index);

      formik.setFieldValue(`entries.${currentCourse}.items`, updatedItems);
    },
    [currentCourse, formik]
  );

  const addMenuImage = useCallback(
    (image: File, preview: string) => {
      setImages((prev) => [
        ...prev,
        {
          image: preview,
          file: image
        }
      ]);
    },
    [setImages]
  );

  const removeMenuImage = useCallback(
    (index: number) => {
      setImages((prev) => {
        const image = prev[index];
        if (image.id) {
          return prev.map((img, i) => (i === index ? { ...img, deleted: true } : img));
        } else {
          return prev.filter((_, i) => i !== index);
        }
      });
    },
    [setImages]
  );

  // Determine if the form is on the last page
  const isLastPage = page === formik.values.courses.length + 1;

  // Render the current entry items for the course
  const currentEntry = currentCourse ? formik.values.entries[currentCourse] || {} : null;
  const currentItems = (currentEntry?.items || []) as Array<z.infer<typeof menuItemSchema>>;

  return (
    <>
      <PageBackButton />
      <div className="w-full max-w-[40rem] mx-auto my-16">
        <h1 className="font-semibold text-xl text-black-base">{currentCourse || 'New Menu'}</h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-full self-start rounded-2xl border border-black-100 shadow-lg px-5 py-9 mt-2.5"
        >
          {/* Menu Basic Info (First Page) */}
          {page === 0 && (
            <>
              {createMenuFields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={formik.values[field.id]}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange(field.id)}
                  error={formik.touched[field.id] && getFormikErrorForId(formik, field.id)}
                  onClick={
                    field.id === 'chef_id' ? () => selectUserModal.current?.showModal() : undefined
                  }
                />
              ))}
            </>
          )}

          {/* Course Entry Pages */}
          {currentCourse && !isLastPage && (
            <>
              {/* Course configuration fields */}
              {createMenuEntryFields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={currentEntry?.[field.id]}
                  onChange={(event) => {
                    formik.setFieldValue(
                      `entries.${currentCourse}.${field.id}`,
                      field.type === 'number' ? Number(event.target.value) : event.target.value
                    );
                  }}
                  error={formik.errors.entries?.[currentCourse]?.[field.id]}
                />
              ))}

              <div className="border-t border-black-100 my-4" />

              {/* Menu items for this course */}
              {currentItems.map((_, index) => (
                <Fragment key={index}>
                  <div className="p-4 border border-black-100 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {currentCourse} Item #{index + 1}
                      </h3>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => removeMenuItem(index)}
                      >
                        <img
                          className="w-4 h-4"
                          src={getImageUrl(`icons/delete.svg`)}
                          alt="Delete item"
                        />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {createMenuItemsFields.map((field) => (
                        <FormField
                          key={field.id}
                          field={field}
                          value={currentItems[index]?.[field.id] || ''}
                          onChange={(event) => {
                            const updatedItems = [...currentItems];
                            updatedItems[index] = {
                              ...updatedItems[index],
                              [field.id]: event.target.value
                            };
                            formik.setFieldValue(`entries.${currentCourse}.items`, updatedItems);
                          }}
                          error={formik.errors.entries?.[currentCourse]?.items?.[index]?.[field.id]}
                        />
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}

              {/* Add new item button */}
              <div className="flex justify-end">
                <button type="button" onClick={addMenuItem} className="btn btn-outline mt-4">
                  Add new {currentCourse?.toLowerCase()} item
                </button>
              </div>
            </>
          )}

          {/* Final Page (Images) */}
          {isLastPage && (
            <div className="p-4">
              <h2 className="text-lg font-medium mb-4">Upload Menu Images</h2>
              <DragAndDropImageContainer className="w-full" onImageGotten={addMenuImage} />

              <div className="mt-6 flex flex-row gap-3 overflow-x-auto no-scrollbar">
                {images.map(({ image }, index) => (
                  <MenuImage key={index} src={image} onRemove={() => removeMenuImage(index)} />
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex gap-5 pt-2.5 border-t border-black-100 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-ghost border-primary text-primary min-w-32"
              disabled={page === 0}
            >
              Back
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="btn btn-primary min-w-32"
              disabled={isPending}
            >
              <LoadingSpinner isLoading={isPending}>
                {isLastPage ? 'Submit' : 'Continue'}
              </LoadingSpinner>
            </button>
          </div>
        </form>

        <SearchUsersModal
          ref={selectUserModal}
          onUserSelected={(user) => {
            formik
              .setFieldValue('chef_id', user.id)
              .then(() => getCurrentFromRef(selectUserModal)?.close());
          }}
          type={UserType.chef}
        />
      </div>
    </>
  );
}
