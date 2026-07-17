import { Activity } from 'react';
import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/helper/formatted-date';
import { cn } from '@/lib/utils';
import type { AccidentDetail } from '@/types/feature/accident/accident';

interface AccidentInfoProps {
    accident: AccidentDetail;
}

interface InfoFieldProps {
    label: string;
    children: React.ReactNode;
}

function InfoField({ label, children }: InfoFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="font-semibold text-foreground">{children}</div>
        </div>
    );
}

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
        resolved: 'border-emerald-500 min-w-32 justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        investigating: 'border-blue-500 min-w-32 justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400',
        rejected: 'border-red-500 min-w-32 justify-center bg-red-500/10 text-red-600 dark:text-red-400',
        pending: 'border-amber-500 min-w-32 justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };

    return badgeStyle[statusValue] ?? '';
}

export function AccidentInfo({ accident }: AccidentInfoProps) {
    return (
        <Card className="pt-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Informasi Insiden</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="ID Laporan">#{accident.id}</InfoField>
                    <InfoField label="Outlet">{accident.outlet?.name ?? '-'}</InfoField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Dilaporkan Oleh">{accident.reporter?.name ?? '-'}</InfoField>
                    <InfoField label="Tanggal Dilaporkan">{formatDate(accident.created_at, true)}</InfoField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Status">
                        <Badge
                            variant={getStatusBadgeVariant(accident.status.value)}
                            className={cn('w-full max-w-44 py-1 font-medium', getStatusBadgeClass(accident.status.value))}
                        >
                            {accident.status.label}
                        </Badge>
                    </InfoField>
                </div>

                <Activity mode={accident.description ? 'visible' : 'hidden'}>
                    <div className="border-t pt-4">
                        <span className="text-sm text-muted-foreground">Catatan Laporan Tambahan</span>
                        <div className="wrap-break-words mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {accident.description}
                        </div>
                    </div>
                </Activity>
            </CardContent>
        </Card>
    );
}
