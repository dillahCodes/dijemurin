import { router, usePage } from '@inertiajs/react';
import { Eye, FileWarning, Pencil } from 'lucide-react';
import { Activity } from 'react';
import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleHelper } from '@/helper/role-helper';
import type { Accident } from '@/types/feature/accident/accident';
import { AccidentStatusEnglish } from '@/types/feature/accident/accident';
import { UserRole } from '@/types/feature/user/user';
import type { AccidentPageProps } from './accident-data-section';
import accidents from '@/routes/accidents';

// Styling for status badge
function getStatusBadgeVariant(statusValue: string): BadgeVariant {
    switch (statusValue) {
        case 'resolved':
            return 'default';
        case 'investigating':
            return 'secondary';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

function getStatusBadgeClass(statusValue: string): string {
    const badgeStyle: Record<string, string> = {
        resolved: 'border-emerald-500 min-w-44 justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        investigating: 'border-blue-500 min-w-44 justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400',
        rejected: 'border-red-500 min-w-44 justify-center bg-red-500/10 text-red-600 dark:text-red-400',
        pending: 'border-amber-500 min-w-44 justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };

    return badgeStyle[statusValue] ?? '';
}

function AccidentTableEmpty() {
    return (
        <Empty className="h-auto w-full bg-muted/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FileWarning />
                </EmptyMedia>
                <EmptyTitle>Tidak Ada Laporan Insiden</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    Bagus! Belum ada data insiden atau kecelakaan laundry yang dilaporkan saat ini.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

interface AccidentTableHeadProps {
    isSuperAdmin: boolean;
}

function AccidentTableHead({ isSuperAdmin }: AccidentTableHeadProps) {
    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px] min-w-[60px] text-center text-xs">No</TableHead>
                <TableHead className="w-[220px] min-w-[220px] text-center text-xs">
                    <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>Pelanggan / Outlet</Activity>
                    <Activity mode={isSuperAdmin ? 'hidden' : 'visible'}>Pelanggan</Activity>
                </TableHead>
                <TableHead className="w-[200px] min-w-[200px] text-center text-xs">No. Pesanan / Jumlah Item</TableHead>
                <TableHead className="w-[150px] min-w-[150px] text-center text-xs">Total Kerugian</TableHead>
                <TableHead className="w-[180px] min-w-[180px] text-center text-xs">Status</TableHead>
                <TableHead className="w-[120px] min-w-[120px] text-center text-xs">Tanggal</TableHead>
                <TableHead className="w-[100px] min-w-[100px] text-center text-xs">Aksi</TableHead>
            </TableRow>
        </TableHeader>
    );
}

interface AccidentTableBodyProps {
    accidentData: Accident[];
}

function AccidentTableBody({ accidentData }: AccidentTableBodyProps) {
    const handleGoToView = (id: number) => () => {
        router.get(accidents.show(id).url);
    };

    const handleGoToEdit = (id: number) => () => {
        router.get(accidents.edit(id).url);
    };

    return (
        <TableBody>
            {accidentData.map((accident, index) => {
                const itemsCount = accident.items_count || 0;
                const itemsText = `${itemsCount} Item`;

                const hasTerminalState = [
                    AccidentStatusEnglish.CANCELLED,
                    AccidentStatusEnglish.RESOLVED,
                    AccidentStatusEnglish.REJECTED,
                ].includes(accident.status.value);

                return (
                    <TableRow key={accident.id} className="group transition-colors">
                        <TableCell className="text-center font-mono text-xs font-semibold whitespace-nowrap text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell className="min-w-[220px] text-center text-xs">
                            <div className="flex flex-col justify-center gap-0.5">
                                <span className="font-semibold text-foreground">{accident.customer_name || '-'}</span>
                                <span className="text-[11px] text-muted-foreground">{accident.outlet_name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="min-w-[200px] text-center text-xs">
                            <div className="flex flex-col gap-0.5">
                                <Activity mode={accident.order_code ? 'visible' : 'hidden'}>
                                    <span className="font-mono font-semibold text-primary">{accident.order_code}</span>
                                </Activity>
                                <span className="text-muted-foreground">{itemsText}</span>
                            </div>
                        </TableCell>
                        <TableCell className="min-w-[150px] text-center text-xs font-semibold">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                            }).format(accident.total_compensation_amount || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant={getStatusBadgeVariant(accident.status.value)}
                                className={getStatusBadgeClass(accident.status.value)}
                            >
                                {accident.status.label}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs whitespace-nowrap">{accident.created_at}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-1.5">
                                <Button size="icon" variant="outline" onClick={handleGoToView(accident.id)} title="Detail">
                                    <Eye size={15} />
                                </Button>
                                <Button
                                    disabled={hasTerminalState}
                                    size="icon"
                                    variant="secondary"
                                    onClick={handleGoToEdit(accident.id)}
                                    title="Edit"
                                >
                                    <Pencil size={15} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export function AccidentTable() {
    const { accidents, auth } = usePage<AccidentPageProps>().props;
    const { data: accidentsData } = accidents;
    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!accidentsData.length) {
        return <AccidentTableEmpty />;
    }

    return (
        <Table>
            <AccidentTableHead isSuperAdmin={isSuperAdmin} />
            <AccidentTableBody accidentData={accidentsData} />
        </Table>
    );
}
