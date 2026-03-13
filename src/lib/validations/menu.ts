import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().nonempty('required').min(3, { message: 'minLength' }),
  category_id: z.string().nonempty('required'),
  description: z.string().optional(),
  price: z.number().positive('positiveNumber'),
  prep_time: z.number().int().min(0),
  calories: z.number().int().min(0),
  is_popular: z.boolean(),
  is_spicy: z.boolean(),
  image: z.any().optional(),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
