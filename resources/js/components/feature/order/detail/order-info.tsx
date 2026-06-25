import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/helper/formatted-date';
import { cn } from '@/lib/utils';
import type { OrderDetail } from '@/types/feature/order/order';
import { getStatusBadgeClass, getStatusBadgeVariant } from '../order-table';

interface OrderInfoProps {
    order: OrderDetail;
}

interface InfoFieldProps {
    label: string;
    children: React.ReactNode;
}

function InfoField({ label, children }: InfoFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="font-semibold">{children}</div>
        </div>
    );
}

export function OrderInfo({ order }: OrderInfoProps) {
    return (
        <Card className="pt-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Informasi Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Kode Pesanan">{order.order_code}</InfoField>
                    <InfoField label="Nama Pelanggan">{order.customer_name}</InfoField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Outlet">{order.outlet?.name ?? '-'}</InfoField>
                    <InfoField label="Kasir">{order.cashier?.name ?? '-'}</InfoField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Tanggal Pesanan">{formatDate(order.created_at, true)}</InfoField>
                    <InfoField label="Estimasi Selesai">
                        {order.estimated_completed_at ? formatDate(order.estimated_completed_at, true) : '-'}
                    </InfoField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Status">
                        <Badge
                            variant={getStatusBadgeVariant(order.status.label)}
                            className={cn('w-full max-w-32 py-1 font-medium', getStatusBadgeClass(order.status.label))}
                        >
                            {order.status.label}
                        </Badge>
                    </InfoField>
                </div>
            </CardContent>
        </Card>
    );
}
