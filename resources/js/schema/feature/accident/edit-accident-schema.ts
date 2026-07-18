import { z } from 'zod';
import { AccidentCompensationTypeEnglish, AccidentTypeEnglish } from '@/types/feature/accident/accident';

export interface CompensationValidationData {
    compensation_type?: string | null;
    compensation_amount?: number | string | null;
}

const transformCompensationAmount = (val: string): number | null => {
    return val === '' ? null : Number(val);
};

const validateCompensation = (data: CompensationValidationData): boolean => {
    const type = data.compensation_type;
    const amount =
        typeof data.compensation_amount === 'string' ? Number(data.compensation_amount) : data.compensation_amount;

    if (type === 'none' || !type) {
        return amount === 0 || amount === null || amount === undefined;
    }

    return amount !== null && amount !== undefined && amount > 0;
};

export const editAccidentItemSchema = z
    .object({
        id: z.number(),
        type: z.enum(AccidentTypeEnglish, { message: 'Jenis insiden wajib diisi.' }),
        item_details: z.string().max(255, { message: 'Detail item maksimal 255 karakter.' }).nullable().optional(),
        description: z.string().min(1, { message: 'Kronologi kerusakan wajib diisi.' }),
        compensation_type: z
            .enum(AccidentCompensationTypeEnglish, { message: 'Jenis kompensasi wajib diisi.' })
            .nullable()
            .optional(),
        compensation_amount: z
            .union([
                z.number(),
                z
                    .string()
                    .regex(/^\d*$/, { message: 'Estimasi kerugian harus berupa angka.' })
                    .transform(transformCompensationAmount),
            ])
            .nullable()
            .optional(),
    })
    .refine(validateCompensation, {
        message: 'Estimasi kerugian wajib diisi > 0 jika ada ganti rugi, atau harus bernilai 0 / kosong jika tidak ada.',
        path: ['compensation_amount'],
    });

export const editAccidentSchema = z.object({
    description: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    items: z.array(editAccidentItemSchema).min(1, { message: 'Minimal satu item kerusakan wajib dilaporkan.' }),
});

export type EditAccidentItemSchema = z.infer<typeof editAccidentItemSchema>;
export type EditAccidentSchema = z.infer<typeof editAccidentSchema>;
