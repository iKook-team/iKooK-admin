import { z } from 'zod';
import { extractInitialValues } from '../../../utils/zodValidator.ts';

const CreatePromoCodeDurationSchema = z.object({
  from_date: z.string().min(3, 'Date is required'),
  from_time: z.string().min(3, 'Time is required'),
  to_date: z.string().min(3, 'Date is required'),
  to_time: z.string().min(3, 'Time is required')
});

const CreatePromoCodeMenuSchema = z.object({
  menu: z.number().min(1, 'Menu is required')
});

const CreatePromoCodeBaseSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(3, 'Description is required'),
  discount_percentage: z.number(),
  code: z.string().min(3, 'Promo code is required'),
  // currency: z.string(),
  num_users: z.number().min(1, 'Number of users is required'),
  has_duration: z.boolean().default(false), // Switch to include duration
  has_menu: z.boolean().default(false) // Switch to include menu
});

export const CreateGiftCardSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  amount: z.number().min(1, 'Amount is required')
});

export const SendGiftCardSchema = z.object({
  gift_card: z.number().min(1, 'Gift is required'),
  email: z.string().email('Invalid email').min(3, 'Email is required'),
  override: z.boolean().default(false)
});

export const CreatePromoCodeSchema = z
  .discriminatedUnion('has_duration', [
    CreatePromoCodeBaseSchema.extend({
      has_duration: z.literal(true)
    }).merge(CreatePromoCodeDurationSchema),
    CreatePromoCodeBaseSchema.extend({
      has_duration: z.literal(false)
    })
  ])
  .and(
    z.discriminatedUnion('has_menu', [
      z
        .object({
          has_menu: z.literal(true)
        })
        .merge(CreatePromoCodeMenuSchema),
      z.object({
        has_menu: z.literal(false)
      })
    ])
  );

export function getCreatePromoInitialValues() {
  return extractInitialValues(
    z.object({
      ...CreatePromoCodeBaseSchema.shape,
      ...CreatePromoCodeDurationSchema.shape,
      ...CreatePromoCodeMenuSchema.shape
    })
  );
}
