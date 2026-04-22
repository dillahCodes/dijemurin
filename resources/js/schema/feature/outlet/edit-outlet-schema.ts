import { OutletStatusOption } from '@/types/feature/outlet/outlet';
import { z } from 'zod';

export const editOutletSchema = z.object({
    name: z.string().min(1, { message: 'Nama outlet wajib diisi.' }),
    address: z.string().min(1, { message: 'Alamat wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }).optional().or(z.literal('')),
    phone: z.string().optional(),
    status: z.enum([OutletStatusOption.ACTIVE, OutletStatusOption.INACTIVE], { message: 'Status tidak valid.' }),
    admin: z.number({ message: 'Admin wajib diisi.' }).min(1, { message: 'Admin wajib diisi.' }),
    cashiers: z.array(z.number({ message: 'Kasir wajib diisi.' })).optional(),
    operators: z.array(z.number({ message: 'Operator wajib diisi.' })).optional(),
});

export type EditOutletSchema = z.infer<typeof editOutletSchema>;
