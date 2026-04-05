import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTable } from '../order/order-table';

export function RecentOrdersSection() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Pesanan Terbaru</CardTitle>
                <CardDescription>Daftar pesanan terbaru yang masuk ke sistem</CardDescription>
            </CardHeader>
            <CardContent>
                <OrderTable />
            </CardContent>
        </Card>
    );
}
