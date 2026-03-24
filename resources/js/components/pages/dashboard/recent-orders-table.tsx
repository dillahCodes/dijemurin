/**
 * types
 */

export interface Order {
    id: string;
    customer: string;
    service: string;
    status: 'Selesai' | 'Diproses' | 'Pending' | 'Batal';
    date: string;
    amount: number;
}

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline';

interface RecentOrdersTableProps {
    orders: Order[];
}

/**
 * utils
 */

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function getStatusBadgeVariant(status: Order['status']): BadgeVariant {
    const variantMap: Record<Order['status'], BadgeVariant> = {
        Selesai: 'default',
        Batal: 'destructive',
        Pending: 'secondary',
        Diproses: 'outline',
    };
    return variantMap[status];
}

function getStatusBadgeClass(status: Order['status']): string {
    if (status === 'Selesai') {
        return 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600';
    }
    if (status === 'Diproses') {
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    }
    return '';
}

/**
 * sub components
 */

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
    status: Order['status'];
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    return (
        <Badge
            variant={getStatusBadgeVariant(status)}
            className={cn('font-medium', getStatusBadgeClass(status))}
        >
            {status}
        </Badge>
    );
}

interface OrderTableRowProps {
    order: Order;
}

function OrderTableRow({ order }: OrderTableRowProps) {
    return (
        <TableRow className="group transition-colors">
            <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                {order.id}
            </TableCell>
            <TableCell className="font-medium">{order.customer}</TableCell>
            <TableCell className="text-muted-foreground">
                {order.service}
            </TableCell>
            <TableCell>
                <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
                {order.date}
            </TableCell>
            <TableCell className="text-right font-semibold">
                {formatCurrency(order.amount)}
            </TableCell>
        </TableRow>
    );
}

/**
 * main component
 */

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Order ID</TableHead>
                    <TableHead className="text-xs">Pelanggan</TableHead>
                    <TableHead className="text-xs">Layanan</TableHead>
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
