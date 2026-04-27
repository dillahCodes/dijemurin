import { z } from 'zod';

export const editServiceItemSchema = z.object({
    name: z.string().min(1, { message: 'Nama layanan wajib diisi.' }).max(255),
    description: z.string().min(1, { message: 'Deskripsi wajib diisi.' }).max(255),
    time: z.string().min(1, { message: 'Waktu pengerjaan wajib diisi.' }).max(255),
    price: z.coerce.number().min(1, { message: 'Harga minimal Rp 1.' }),
    unit: z.string().min(1, { message: 'Satuan wajib diisi.' }).max(255),
    service_id: z.number().min(1, { message: 'Layanan wajib diisi.' }),
});

export type EditServiceItemSchema = z.infer<typeof editServiceItemSchema>;
