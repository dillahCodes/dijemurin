import { Activity } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AccidentItem } from '@/types/feature/accident/accident';

interface AccidentItemsTableProps {
    items: AccidentItem[];
}

function formatRupiah(value: number | null): string {
    if (value === null || value === 0) {
        return '-';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function getTypeBadgeClass(typeValue: string): string {
    const typeStyle: Record<string, string> = {
        lost_item: 'border-slate-500 justify-center bg-slate-500/10 text-slate-600 dark:text-slate-400',
        damaged_item: 'border-rose-500 justify-center bg-rose-500/10 text-rose-600 dark:text-rose-400',
        color_bled: 'border-purple-500 justify-center bg-purple-500/10 text-purple-600 dark:text-purple-400',
        shrunk_item: 'border-sky-500 justify-center bg-sky-500/10 text-sky-600 dark:text-sky-400',
        late_delivery: 'border-orange-500 justify-center bg-orange-500/10 text-orange-600 dark:text-orange-400',
        wrong_delivery: 'border-amber-500 justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400',
        other: 'border-neutral-500 justify-center bg-neutral-500/10 text-neutral-600 dark:text-neutral-400',
    };

    return typeStyle[typeValue] ?? '';
}

export function AccidentItemsTable({ items }: AccidentItemsTableProps) {
    const hasNoItems = items.length === 0;
    const hasItems = items.length > 0;

    return (
        <Card className="pt-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Daftar Barang & Kompensasi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[60px] text-center text-xs">No</TableHead>
                            <TableHead className="w-[180px] text-xs">Item Layanan</TableHead>
                            <TableHead className="w-[140px] text-center text-xs">Jenis Insiden</TableHead>
                            <TableHead className="w-[180px] text-xs">Detail Item</TableHead>
                            <TableHead className="text-xs">Kronologi Kerusakan</TableHead>
                            <TableHead className="w-[140px] text-center text-xs">Tipe Kompensasi</TableHead>
                            <TableHead className="w-[140px] pr-6 text-right text-xs">Estimasi Kerugian/Kompensasi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <Activity mode={hasNoItems ? 'visible' : 'hidden'}>
                            <TableRow>
                                <TableCell colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                                    Tidak ada item insiden yang terdaftar.
                                </TableCell>
                            </TableRow>
                        </Activity>

                        <Activity mode={hasItems ? 'visible' : 'hidden'}>
                            {items.map((item, index) => {
                                const hasCompensation = !!item.compensation_type;

                                return (
                                    <TableRow key={item.id} className="transition-colors">
                                        <TableCell className="text-center font-mono text-xs font-semibold text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold text-foreground">
                                            {item.order_item_name || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={getTypeBadgeClass(item.type.value)}>
                                                {item.type.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            <div className="wrap-break-words max-w-[180px] break-all">
                                                {item.item_details || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            <div className="wrap-break-words max-w-[300px] break-all whitespace-pre-wrap">
                                                {item.description}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            <Activity mode={hasCompensation ? 'visible' : 'hidden'}>
                                                <span className="font-medium text-foreground">
                                                    {item.compensation_type?.label}
                                                </span>
                                            </Activity>
                                            <Activity mode={hasCompensation ? 'hidden' : 'visible'}>
                                                <span className="text-muted-foreground">-</span>
                                            </Activity>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right text-xs font-semibold text-primary">
                                            {formatRupiah(item.compensation_amount)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </Activity>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
