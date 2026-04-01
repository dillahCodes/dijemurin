import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/types/feature/order';
import { RecentOrdersTable } from './recent-orders-table';

const RECENT_ORDERS: Order[] = [
    {
        id: 1,
        order_code: 'ORD-001',
        customer_name: 'Budi Santoso',
        payment_method: 'qris',
        status: 'Selesai',
        order_at: '2026-03-24T10:00:00.000000Z',
        created_at: '2026-03-24T10:00:00.000000Z',
        updated_at: '2026-03-24T10:00:00.000000Z',
        total_price: 45000,
    },
    {
        id: 2,
        order_code: 'ORD-002',
        customer_name: 'Siti Aminah',
        payment_method: 'cash',
        status: 'Diproses',
        order_at: '2026-03-24T11:00:00.000000Z',
        created_at: '2026-03-24T11:00:00.000000Z',
        updated_at: '2026-03-24T11:00:00.000000Z',
        total_price: 30000,
    },
    {
        id: 3,
        order_code: 'ORD-003',
        customer_name: 'Ahmad Yani',
        payment_method: 'transfer',
        status: 'Pending',
        order_at: '2026-03-24T12:00:00.000000Z',
        created_at: '2026-03-24T12:00:00.000000Z',
        updated_at: '2026-03-24T12:00:00.000000Z',
        total_price: 25000,
    },
    {
        id: 4,
        order_code: 'ORD-004',
        customer_name: 'Dewi Lestari',
        payment_method: 'qris',
        status: 'Selesai',
        order_at: '2026-03-23T14:00:00.000000Z',
        created_at: '2026-03-23T14:00:00.000000Z',
        updated_at: '2026-03-23T14:00:00.000000Z',
        total_price: 50000,
    },
    {
        id: 5,
        order_code: 'ORD-005',
        customer_name: 'Rudi Hermawan',
        payment_method: 'cash',
        status: 'Batal',
        order_at: '2026-03-23T15:00:00.000000Z',
        created_at: '2026-03-23T15:00:00.000000Z',
        updated_at: '2026-03-23T15:00:00.000000Z',
        total_price: 60000,
    },
];

export function RecentOrdersSection() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Pesanan Terbaru</CardTitle>
                <CardDescription>Daftar pesanan terbaru yang masuk ke sistem</CardDescription>
            </CardHeader>
            <CardContent>
                <RecentOrdersTable orders={RECENT_ORDERS} />
            </CardContent>
        </Card>
    );
}
