import { z } from 'zod';
import { UserStatus } from '@/types/feature/user/user';

export const userEditSchema = z.object({
    name: z.string().min(1, { message: 'Nama wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }),
    status: z.enum(UserStatus),
});

export type UserEditSchema = z.infer<typeof userEditSchema>;
