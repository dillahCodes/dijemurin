import { z } from 'zod';

import { ServiceTimeType } from '@/types/feature/layanan';

export const editServiceItemSchema = z.object({
    name: z.string().min(1, { message: 'Nama layanan wajib diisi.' }).max(255),
    description: z.string().min(1, { message: 'Deskripsi wajib diisi.' }).max(255),
    time_number: z.coerce.number().min(1, { message: 'Waktu pengerjaan wajib diisi.' }),
    time_type: z.enum(ServiceTimeType, { message: 'Tipe waktu tidak valid.' }),
    price: z.coerce.number().min(1, { message: 'Harga minimal Rp 1.' }),
    unit: z.string().min(1, { message: 'Satuan wajib diisi.' }).max(255),
    service_id: z.number().min(1, { message: 'Layanan wajib diisi.' }),
});

export type EditServiceItemSchema = z.infer<typeof editServiceItemSchema>;
