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

/**
 * constants
 */

const STATIC_ORDERS: Order[] = [
    { id: 'ORD-001', customer: 'Budi Santoso', service: 'Cuci Komplit', status: 'Selesai', date: '24 Mar 2026', amount: 45000 },
    { id: 'ORD-002', customer: 'Siti Aminah', service: 'Setrika Saja', status: 'Diproses', date: '24 Mar 2026', amount: 30000 },
    { id: 'ORD-003', customer: 'Ahmad Yani', service: 'Cuci Kering', status: 'Pending', date: '24 Mar 2026', amount: 25000 },
    { id: 'ORD-004', customer: 'Dewi Lestari', service: 'Cuci Selimut', status: 'Selesai', date: '23 Mar 2026', amount: 50000 },
    { id: 'ORD-005', customer: 'Rudi Hermawan', service: 'Cuci Ekspres', status: 'Batal', date: '23 Mar 2026', amount: 60000 },
    { id: 'ORD-006', customer: 'Nina Marlina', service: 'Cuci Komplit', status: 'Diproses', date: '22 Mar 2026', amount: 40000 },
    { id: 'ORD-007', customer: 'Aris Setiawan', service: 'Setrika Saja', status: 'Selesai', date: '22 Mar 2026', amount: 25000 },
    { id: 'ORD-008', customer: 'Fina Andra', service: 'Cuci Kering', status: 'Pending', date: '21 Mar 2026', amount: 30000 },
    { id: 'ORD-009', customer: 'Yoga Pratama', service: 'Cuci Ekspres', status: 'Selesai', date: '21 Mar 2026', amount: 65000 },
    { id: 'ORD-010', customer: 'Rina Nose', service: 'Cuci Selimut', status: 'Diproses', date: '20 Mar 2026', amount: 55000 },
];

const SERVICE_OPTIONS = ['Semua Layanan', 'Cuci Komplit', 'Setrika Saja', 'Cuci Kering', 'Cuci Selimut', 'Cuci Ekspres'];
const STATUS_OPTIONS = ['Semua Status', 'Selesai', 'Diproses', 'Pending', 'Batal'];

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
    if (status === 'Selesai') return 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600';
    if (status === 'Diproses') return 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    return '';
}

/**
 * hooks
 */

import { useMemo, useState } from 'react';

function useOrderFilters(orders: Order[]) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('Semua Status');
    const [service, setService] = useState('Semua Layanan');

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                                order.id.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === 'Semua Status' || order.status === status;
            const matchService = service === 'Semua Layanan' || order.service === service;

            return matchSearch && matchStatus && matchService;
        });
    }, [orders, search, status, service]);

    return {
        search,
        setSearch,
        status,
        setStatus,
        service,
        setService,
        filteredOrders,
    };
}

/**
 * sub components
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface OrderFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    service: string;
    setService: (val: string) => void;
}

function OrderFilters({ search, setSearch, status, setStatus, service, setService }: OrderFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari pelanggan atau ID order..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Layanan" />
                    </SelectTrigger>
                    <SelectContent>
                        {SERVICE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

interface OrderTableProps {
    orders: Order[];
}

function OrderTable({ orders }: OrderTableProps) {
    if (orders.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Tidak ada data order ditemukan.
            </div>
        );
    }

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
                    <TableRow key={order.id} className="group transition-colors">
                        <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                            {order.id}
                        </TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{order.service}</TableCell>
                        <TableCell>
                            <Badge
                                variant={getStatusBadgeVariant(order.status)}
                                className={cn('font-medium', getStatusBadgeClass(order.status))}
                            >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(order.amount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

/**
 * main component
 */

export function OrderDataSection() {
    const { search, setSearch, status, setStatus, service, setService, filteredOrders } =
        useOrderFilters(STATIC_ORDERS);

    return (
        <Card className="flex flex-1 flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">Daftar Order</CardTitle>
                    <CardDescription>
                        Kelola dan filter data pesanan laundry Anda.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-6">
                <OrderFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    service={service}
                    setService={setService}
                />
                <div className="rounded-md border">
                    <OrderTable orders={filteredOrders} />
                </div>
            </CardContent>
        </Card>
    );
}
