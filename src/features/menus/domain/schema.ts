import { z } from 'zod';
import { CuisineTypeEnum, EventTypeEnum } from './types.ts';

export const CourseTypeEnum = z.enum(['Starter', 'Main', 'Dessert', 'Side']);

export const menuItemSchema = z.object({
  course: CourseTypeEnum,
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  menu: z.number().nullable()
});

export const createMenuEntrySchema = z
  .object({
    selection_limit: z.number().int().min(1, { message: 'Selection limit must be at least 1' }),
    extra_charge_per_person: z.number().min(0, { message: 'Extra charge must be at least 0' }),
    items: z.array(menuItemSchema).min(1, { message: 'At least one item is required' })
  })
  .superRefine((data, ctx) => {
    const expected = data?.selection_limit || 1;
    const actual = data?.items?.length || 0;
    if (actual < expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `You must create at least ${expected} item(s)`,
        path: ['items']
      });
    }
  });

export const createMenuSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price_per_person: z.number().min(1, { message: 'Price is required' }),
  num_of_guests: z.number().int().min(1),
  max_menu_selection: z.number().int().min(1),
  event_types: z.array(EventTypeEnum).min(1, { message: 'At least one event type is required' }),
  cuisine_types: z
    .array(CuisineTypeEnum)
    .min(1, { message: 'At least one cuisine type is required' }),
  menu_type: z.string().min(1, { message: 'Menu type is required' }),
  courses: z.array(CourseTypeEnum).min(1, { message: 'At least one course is required' }),
  chef_id: z.number().int().min(1, { message: 'Chef ID is required' }),
  status: z.enum(['Active', 'Inactive'])
});

export const createMenuEntriesSchema = z.object({
  entries: z.record(CourseTypeEnum, createMenuEntrySchema)
});
