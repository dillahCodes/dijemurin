import { z } from 'zod';

export const checkoutSchema = z
    .object({
        customerName: z.string().min(1, { message: 'Nama pelanggan wajib diisi.' }),
        paymentMethod: z.enum(['cash', 'qris'], { message: 'Metode pembayaran tidak valid.' }),
        paymentAmount: z.number(),
        totalBayar: z.number(),
        itemsLength: z.number().min(1, { message: 'Keranjang tidak boleh kosong.' }),
    })
    .superRefine((val, ctx) => {
        if (val.paymentMethod === 'cash' && val.paymentAmount < val.totalBayar) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Nominal pembayaran kurang dari total tagihan.',
                path: ['paymentAmount'],
            });
        }
    });

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
