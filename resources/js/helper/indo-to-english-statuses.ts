import { OrderStatusEnglish, OrderStatusIndonesian } from '@/types/feature/order';

export const indoToEnglishStatuses = Object.entries(OrderStatusIndonesian).reduce(
    (acc, [key, val]) => {
        acc[val] = OrderStatusEnglish[key as keyof typeof OrderStatusEnglish];

        return acc;
    },
    {} as Record<string, string>,
);
