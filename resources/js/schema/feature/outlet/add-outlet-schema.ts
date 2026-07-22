import { z } from 'zod';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const addOutletSchema = z.object({
    name: z.string().min(1, { message: 'Nama outlet wajib diisi.' }),
    address: z.string().min(1, { message: 'Alamat wajib diisi.' }),
    email: z.email({ message: 'Format email tidak valid.' }).optional().or(z.literal('')),
    phone: z.string().optional(),
    picture: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_IMAGE_SIZE, `Ukuran file maksimal 2MB`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Format file tidak didukung')
        .optional()
        .nullable(),
});

export type AddOutletSchema = z.infer<typeof addOutletSchema>;
