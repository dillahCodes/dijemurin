import { z } from 'zod';

export const addOutletSchema = z.object({
    name: z.string().min(1, { message: 'Nama outlet wajib diisi.' }),
    address: z.string().min(1, { message: 'Alamat wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }).optional().or(z.literal('')),
    phone: z.string().optional(),
    admin: z.number().min(1, { message: 'Admin wajib diisi.' }),
    cashiers: z.array(z.number()).optional(),
    operators: z.array(z.number()).optional(),
});

export type AddOutletSchema = z.infer<typeof addOutletSchema>;
