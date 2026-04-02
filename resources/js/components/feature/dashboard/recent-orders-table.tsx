import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Order } from '@/types/feature/order';

/**
 * 1. Local Types
 */
type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline';

interface RecentOrdersTableProps {
    orders: Order[];
}

interface OrderStatusBadgeProps {
    status: string;
}

interface OrderTableRowProps {
    order: Order;
}

/**
 * Utils
 */
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

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

function displayDate(isoDateString: string): string {
    if (!isoDateString) {
        return '-';
    }

    try {
        const date = new Date(isoDateString);

        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    } catch {
        return isoDateString;
    }
}

/**
 * 2. Sub-components
 */
function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    return (
        <Badge variant={getStatusBadgeVariant(status)} className={cn('font-medium', getStatusBadgeClass(status))}>
            {displayStatus(status)}
        </Badge>
    );
}

function OrderTableRow({ order }: OrderTableRowProps) {
    return (
        <TableRow className="group transition-colors">
            <TableCell className="font-mono text-xs font-semibold text-muted-foreground">{order.order_code}</TableCell>
            <TableCell className="font-medium">{order.customer_name}</TableCell>
            <TableCell className="text-xs text-muted-foreground uppercase">{order.payment_method}</TableCell>
            <TableCell>
                <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{displayDate(order.order_at)}</TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(order.total_price)}</TableCell>
        </TableRow>
    );
}

/**
 * 3. Main Component
 */
export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Order ID</TableHead>
                    <TableHead className="text-xs">Pelanggan</TableHead>
                    <TableHead className="text-xs">Metode</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Tanggal</TableHead>
                    <TableHead className="text-right text-xs">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <OrderTableRow key={order.id} order={order} />
                ))}
            </TableBody>
        </Table>
    );
}
