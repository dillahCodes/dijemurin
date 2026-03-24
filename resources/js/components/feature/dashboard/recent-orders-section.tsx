import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RecentOrdersTable } from './recent-orders-table';
import type { Order } from '@/types/features/order';

const RECENT_ORDERS: Order[] = [
    {
        id: 'ORD-001',
        customer: 'Budi Santoso',
        service: 'Cuci Komplit',
        status: 'Selesai',
        date: '24 Mar 2026',
        amount: 45000,
    },
    {
        id: 'ORD-002',
        customer: 'Siti Aminah',
        service: 'Setrika Saja',
        status: 'Diproses',
        date: '24 Mar 2026',
        amount: 30000,
    },
    {
        id: 'ORD-003',
        customer: 'Ahmad Yani',
        service: 'Cuci Kering',
        status: 'Pending',
        date: '24 Mar 2026',
        amount: 25000,
    },
    {
        id: 'ORD-004',
        customer: 'Dewi Lestari',
        service: 'Cuci Selimut',
        status: 'Selesai',
        date: '23 Mar 2026',
        amount: 50000,
    },
    {
        id: 'ORD-005',
        customer: 'Rudi Hermawan',
        service: 'Cuci Ekspres',
        status: 'Batal',
        date: '23 Mar 2026',
        amount: 60000,
    },
];

export function RecentOrdersSection() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    Pesanan Terbaru
                </CardTitle>
                <CardDescription>
                    Daftar pesanan terbaru yang masuk ke sistem
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RecentOrdersTable orders={RECENT_ORDERS} />
            </CardContent>
        </Card>
    );
}
