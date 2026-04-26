import { z } from 'zod';

export const userAddSchema = z.object({
    name: z.string().min(1, { message: 'Nama wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }),
});

export type UserAddSchema = z.infer<typeof userAddSchema>;
