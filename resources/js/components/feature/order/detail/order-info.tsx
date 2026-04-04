import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/helper/formatted-date';
import { cn } from '@/lib/utils';
import type { OrderDetail } from '@/types/feature/order';
import { getStatusBadgeClass, getStatusBadgeVariant } from '../order-table';

interface OrderInfoProps {
    order: OrderDetail;
}

export function OrderInfo({ order }: OrderInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                    <span className="text-sm text-muted-foreground">Kode Pesanan</span>
                    <p className="font-semibold">{order.order_code}</p>
                </div>
                <div>
                    <span className="text-sm text-muted-foreground">Nama Pelanggan</span>
                    <p className="font-semibold">{order.customer_name}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                        variant={getStatusBadgeVariant(order.status.label)}
                        className={cn('w-full max-w-32 py-1 font-medium', getStatusBadgeClass(order.status.label))}
                    >
                        {order.status.label}
                    </Badge>
                </div>
                <div>
                    <span className="text-sm text-muted-foreground">Tanggal Pesanan</span>
                    <p className="font-semibold">{formatDate(order.order_at)}</p>
                </div>
            </CardContent>
        </Card>
    );
}
