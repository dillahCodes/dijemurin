import { z } from 'zod';
import { AccidentTypeEnglish } from '@/types/feature/accident/accident';

export const addAccidentItemSchema = z.object({
    order_item_id: z.number({ message: 'Item pesanan wajib dipilih.' }),
    type: z.enum(AccidentTypeEnglish, { message: 'Jenis insiden wajib diisi.' }),
    item_details: z.string().max(255, { message: 'Detail item maksimal 255 karakter.' }).nullable().optional(),
    description: z.string().min(1, { message: 'Kronologi kerusakan wajib diisi.' }),
});

export const addAccidentSchema = z.object({
    outlet_id: z.number(),
    order_id: z.number().min(1, { message: 'Pesanan wajib diisi.' }),
    description: z.string().nullable().optional(),
    items: z.array(addAccidentItemSchema).min(1, { message: 'Minimal satu item kerusakan wajib dilaporkan.' }),
});

export type AddAccidentItemSchema = z.infer<typeof addAccidentItemSchema>;
export type AddAccidentSchema = z.infer<typeof addAccidentSchema>;
