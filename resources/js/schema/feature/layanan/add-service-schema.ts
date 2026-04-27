import { z } from 'zod';

export const addServiceSchema = z.object({
    name: z.string().min(1, { message: 'Nama layanan wajib diisi.' }),
    description: z.string().min(1, { message: 'Deskripsi wajib diisi.' }),
    outlet_id: z.number({ error: 'Outlet wajib diisi.' }).min(1, { message: 'Outlet wajib diisi.' }),
});

export type AddServiceSchema = z.infer<typeof addServiceSchema>;
