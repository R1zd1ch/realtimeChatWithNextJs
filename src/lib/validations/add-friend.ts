import { z } from 'zod';

export const addFriendValidator = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email address is required' })
    .email({ message: 'Invalid email address' }),
});
