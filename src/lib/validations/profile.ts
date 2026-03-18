import { z } from 'zod';

export const restaurantSettingsSchema = z.object({
  name: z.string().nonempty('required').min(3, { message: 'minLength' }),
  email: z.string().email('invalidEmail').nonempty('required'),
  phone: z.string().nonempty('required'),
  address: z.string().nonempty('required'),
  currency: z.string().nonempty('required'),
  timezone: z.string().nonempty('required'),
  language: z.string().nonempty('required'),
});

export const passwordSchema = z.object({
  password: z.string().nonempty('required').min(6, { message: 'minLength' }),
  confirmPassword: z.string().nonempty('required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwordsDoNotMatch",
  path: ["confirmPassword"],
});

export const userProfileSchema = z.object({
  fullName: z.string().nonempty('required').min(3, { message: 'minLength' }),
  avatar: z.any().optional(),
});

export const onboardingRestaurantSchema = z.object({
  name: z.string().nonempty('required').min(3, { message: 'minLength' }),
  currency: z.string(),
  timezone: z.string(),
  language: z.string(),
});

export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>;
export type OnboardingRestaurantInput = z.infer<typeof onboardingRestaurantSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
