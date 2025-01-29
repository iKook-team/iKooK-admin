import { z } from 'zod';

export const CreateWithdrawalSchema = z.object({
  chef: z.string().min(1, 'Chef is required'),
  amount: z.number().min(1, 'Amount is required')
});
