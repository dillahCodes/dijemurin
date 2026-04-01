import { usePage } from '@inertiajs/react';
import { Eye, Pencil, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helper/formatted-date';
import { formatPrice } from '@/helper/formatted-price';
import { cn } from '@/lib/utils';
import type { OrderPageProps } from './order-data-section';

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline';

function getStatusBadgeVariant(status: string): BadgeVariant {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
        case 'selesai':
            return 'default';
        case 'batal':
            return 'destructive';
        case 'pending':
            return 'secondary';
        case 'diproses':
            return 'outline';
        default:
            return 'outline';
    }
}

function getStatusBadgeClass(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'selesai') {
        return 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600';
    }

    if (normalizedStatus === 'diproses') {
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    }

    return '';
}

function displayStatus(status: string): string {
    if (!status) {
return '-';
}

    // capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function OrderTableEmpty() {
    return (
        <Empty className="h-auto w-full bg-muted/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ShoppingBag />
                </EmptyMedia>
                <EmptyTitle>Belum ada pesanan</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    Anda belum memiliki pesanan. Silahkan tambahkan pesanan untuk memulai.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

export function OrderTable() {
    const { orders } = usePage<OrderPageProps>().props;
    const { data: ordersData } = orders;

    if (!ordersData.length) {
return <OrderTableEmpty />;
}

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-center text-xs">Order ID</TableHead>
                    <TableHead className="text-center text-xs">Pelanggan</TableHead>
                    <TableHead className="text-center text-xs">Metode Pembayaran</TableHead>
                    <TableHead className="text-center text-xs">Status</TableHead>
                    <TableHead className="text-center text-xs">Tanggal</TableHead>
                    <TableHead className="text-center text-xs">Total</TableHead>
                    <TableHead className="text-center text-xs">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ordersData.map((order) => (
                    <TableRow key={order.id} className="group transition-colors">
                        <TableCell className="text-center font-mono text-xs font-semibold whitespace-nowrap text-muted-foreground">
                            {order.order_code}
                        </TableCell>
                        <TableCell className="text-center font-medium">{order.customer_name}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground uppercase">
                            {order.payment_method}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant={getStatusBadgeVariant(order.status)}
                                className={cn('font-medium', getStatusBadgeClass(order.status))}
                            >
                                {displayStatus(order.status)}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap text-muted-foreground">
                            {formatDate(order.order_at)}
                        </TableCell>
                        <TableCell className="text-center font-semibold">{formatPrice(order.total_price)}</TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                            <Button size="icon" variant="outline">
                                <Eye />
                            </Button>
                            <Button size="icon">
                                <Pencil />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
