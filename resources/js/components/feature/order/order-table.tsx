import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useModal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helper/formatted-date';
import { formatPrice } from '@/helper/formatted-price';
import { cn } from '@/lib/utils';
import type { Order, OrderStatusIndonesian } from '@/types/feature/order';
import { usePage } from '@inertiajs/react';
import { Eye, Pencil, Printer, ShoppingBag } from 'lucide-react';
import type { OrderPageProps } from './order-data-section';
import { OrderTableEdit } from './order-table-edit';

function getStatusBadgeVariant(status: OrderStatusIndonesian): BadgeVariant {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
        case 'selesai':
            return 'default';
        case 'dibatalkan':
            return 'destructive';
        case 'pending':
            return 'secondary';
        case 'diproses':
            return 'outline';
        case 'diambil':
            return 'secondary';
        default:
            return 'outline';
    }
}

function getStatusBadgeClass(status: OrderStatusIndonesian): string {
    const badgeStatusStyle: Record<OrderStatusIndonesian, string> = {
        Selesai: 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600',
        Dibatalkan: 'border-destructive bg-destructive text-white hover:bg-destructive/90',
        Menunggu: 'border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90',
        Diproses: 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        Diambil: 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600',
    };

    return badgeStatusStyle[status];
}

function OrderTableEmpty() {
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
    const model = useModal();
    const { orders, orderStatusOptions } = usePage<OrderPageProps>().props;
    const { data: ordersData } = orders;

    const handleOpenEditModal = (order: Order) => () => {
        model.open({
            id: `edit-order-${order.id}`,
            title: `Edit Order`,
            description: `Order ID: ${order.order_code}`,
            content: <OrderTableEdit order={order} orderStatusOptions={orderStatusOptions} />,
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

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
                {ordersData.map((order) => {
                    const isCancelled = order.status.value === 'cancelled';
                    const isPickedUp = order.status.value === 'picked up';
                    const disabledButtonEdit = isCancelled || isPickedUp;

                    return (
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
                                    variant={getStatusBadgeVariant(order.status.label)}
                                    className={cn('font-medium', getStatusBadgeClass(order.status.label))}
                                >
                                    {order.status.label}
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
                                <Button size="icon" disabled={disabledButtonEdit} onClick={handleOpenEditModal(order)}>
                                    <Pencil />
                                </Button>
                                <Button size="icon" variant="secondary">
                                    <Printer />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
