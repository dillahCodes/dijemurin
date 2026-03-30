import { z } from 'zod';

const qtySchema = z
    .number({ error: 'Kuantitas harus berupa angka' })
    .min(0.1, { message: 'Minimal order 0.1' })
    .multipleOf(0.01, { message: 'Maksimal hanya boleh 2 angka di belakang koma' });

export const cartItemSchema = z.object({
    qty: qtySchema,
});

export type CartItemSchemaType = z.infer<typeof cartItemSchema>;
