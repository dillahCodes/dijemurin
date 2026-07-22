import { usePage } from '@inertiajs/react';
import { Eye, Loader2, Pencil, Printer, ShoppingBag } from 'lucide-react';
import { Activity } from 'react';
import { Fragment } from 'react/jsx-runtime';
import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePrinterController } from '@/context/feature/printer/printer-controller-context';
import { formatDate } from '@/helper/formatted-date';
import { formatPrice } from '@/helper/formatted-price';
import { generateOrderInvoice } from '@/helper/generate-order-invoice';
import { RoleHelper } from '@/helper/role-helper';
import { useOrderPrintData } from '@/hooks/feature/order/use-order-print-data';
import { useOrderTableActions } from '@/hooks/feature/order/use-order-table-actions';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types/auth';
import type { Order, OrderStatusIndonesian } from '@/types/feature/order/order';
import { UserRole } from '@/types/feature/user/user';
import type { OrderPageProps } from './order-data-section';

export function getStatusBadgeVariant(status: OrderStatusIndonesian): BadgeVariant {
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

export function getStatusBadgeClass(status: OrderStatusIndonesian): string {
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

interface OrderTableHeadProps {
    isSuperAdmin: boolean;
}

function OrderTableHead({ isSuperAdmin }: OrderTableHeadProps) {
    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="text-center text-xs">Order ID</TableHead>
                <TableHead className="text-center text-xs">
                    <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>Pelanggan / Outlet</Activity>
                    <Activity mode={isSuperAdmin ? 'hidden' : 'visible'}>Pelanggan</Activity>
                </TableHead>
                <TableHead className="text-center text-xs">Metode Pembayaran</TableHead>
                <TableHead className="text-center text-xs">Status</TableHead>
                <TableHead className="text-center text-xs">Tanggal Dibuat</TableHead>
                <TableHead className="text-center text-xs">Terakhir Diubah</TableHead>
                <TableHead className="text-center text-xs">Total</TableHead>
                <TableHead className="text-center text-xs">Aksi</TableHead>
            </TableRow>
        </TableHeader>
    );
}

interface OrderRowPrintProps {
    order: Order;
}

function OrderRowPrint({ order }: OrderRowPrintProps) {
    const { handlePrint, isPrinting } = usePrinterController();
    const { isLoading: isLoadingOrderPrintData, refetch } = useOrderPrintData(order);

    const isOrderCancelled = order.status.value === 'cancelled';
    const disableButton = isLoadingOrderPrintData || isOrderCancelled || isPrinting;
    const isLoadingButton = isLoadingOrderPrintData || isPrinting;

    const handllePrint = async () => {
        const { data } = await refetch();

        if (!data?.data) {
            return;
        }

        const invoice = generateOrderInvoice(data?.data);
        handlePrint(invoice, data?.data?.order_code);
    };

    return (
        <Fragment>
            <Button size="icon" variant="secondary" onClick={handllePrint} disabled={disableButton}>
                {isLoadingButton ? <Loader2 className="animate-spin" /> : <Printer />}
            </Button>
        </Fragment>
    );
}

interface OrderTableBodyProps {
    ordersData: Order[];
    isSuperAdmin: boolean;
}

function OrderTableBody({ ordersData, isSuperAdmin }: OrderTableBodyProps) {
    const { handleOpenEditModal, handleGoToShow } = useOrderTableActions();

    return (
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
                        <TableCell className="text-center text-xs">
                            <div className="flex flex-col justify-center gap-0.5">
                                <span className="font-semibold text-foreground">{order.customer_name || '-'}</span>
                                <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>
                                    <span className="text-[11px] text-muted-foreground">{order.outlet?.name ?? '-'}</span>
                                </Activity>
                            </div>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground uppercase">
                            {order.payment_method}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant={getStatusBadgeVariant(order.status.label)}
                                className={cn('w-full max-w-32 py-1 font-medium', getStatusBadgeClass(order.status.label))}
                            >
                                {order.status.label}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap text-muted-foreground">
                            {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap text-muted-foreground">
                            {formatDate(order.updated_at)}
                        </TableCell>
                        <TableCell className="text-center font-semibold">{formatPrice(order.total_price)}</TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                            <Button size="icon" variant="outline" onClick={handleGoToShow(order)}>
                                <Eye />
                            </Button>
                            <Button size="icon" disabled={disabledButtonEdit} onClick={handleOpenEditModal(order)}>
                                <Pencil />
                            </Button>
                            <OrderRowPrint order={order} />
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export function OrderTable() {
    const { orders, auth } = usePage<OrderPageProps>().props;
    const { data: ordersData } = orders;
    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!ordersData.length) {
        return <OrderTableEmpty />;
    }

    return (
        <Table>
            <OrderTableHead isSuperAdmin={isSuperAdmin} />
            <OrderTableBody ordersData={ordersData} isSuperAdmin={isSuperAdmin} />
        </Table>
    );
}
