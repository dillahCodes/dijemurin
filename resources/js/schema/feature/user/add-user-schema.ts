import { z } from 'zod';
import { UserRole } from '@/types/feature/user/user';

export const userAddSchema = z.object({
    name: z.string().min(1, { message: 'Nama wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }),
    outlet_id: z.number().nullable().optional(),
    role: z.enum(UserRole).optional(),
});

export type UserAddSchema = z.infer<typeof userAddSchema>;
