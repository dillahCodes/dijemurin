import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import order from '@/routes/order';
import type { Order, OrderDetail } from '@/types/feature/order';
import type { ApiResponse } from '@/types/response';

export function useOrderPrintData(orderData: Order) {
    return useQuery({
        queryKey: ['order-print-data', orderData.id],
        queryFn: async () => {
            const res = await axios.get(order.print(orderData.id).url);

            return res.data as ApiResponse<OrderDetail>;
        },
        enabled: false,
    });
}
