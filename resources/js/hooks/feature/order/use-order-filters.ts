import { useMemo, useState } from 'react';
import type { Order } from '@/types/feature/order';

export function useOrderFilters(orders: Order[]) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('Semua Status');
    const [service, setService] = useState('Semua Layanan');

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch =
                order.customer.toLowerCase().includes(search.toLowerCase()) ||
                order.id.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === 'Semua Status' || order.status === status;
            const matchService = service === 'Semua Layanan' || order.service === service;

            return matchSearch && matchStatus && matchService;
        });
    }, [orders, search, status, service]);

    return {
        search,
        setSearch,
        status,
        setStatus,
        service,
        setService,
        filteredOrders,
    };
}
