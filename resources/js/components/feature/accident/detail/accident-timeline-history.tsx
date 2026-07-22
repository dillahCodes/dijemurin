import { User, ArrowRight, History, Edit2, Package, Clock } from 'lucide-react';
import { Activity } from 'react';
import { formatDate, formatTime } from '@/helper/formatted-date';
import { formatPrice } from '@/helper/formatted-price';
import type { AccidentLog, AccidentStatusLog, AccidentFieldLog } from '@/types/feature/accident/accident';

interface AccidentTimelineHistoryProps {
    logs: AccidentLog[];
}

const fieldLabels: Record<string, string> = {
    description: 'Catatan Laporan',
    type: 'Tipe Insiden',
    compensation_type: 'Tipe Kompensasi',
    compensation_amount: 'Jumlah Kompensasi',
    item_details: 'Detail Barang',
};

const valueLabels: Record<string, string> = {
    // Tipe Kerusakan
    lost_item: 'Barang Hilang',
    damaged_item: 'Barang Rusak',
    color_bled: 'Luntur',
    shrunk_item: 'Pakaian Menyusut',
    late_delivery: 'Terlambat Selesai',
    wrong_delivery: 'Salah Antar / Tertukar',
    other: 'Lainnya',

    // Tipe Kompensasi
    none: 'Tidak Ada',
    refund: 'Pengembalian Uang',
    replacement: 'Ganti Barang Baru',
    free_service: 'Layanan Gratis',
    repair: 'Perbaikan Barang',
};

const formatLogValue = (field: string, value: string | null) => {
    const emptyEquivalents: Record<string, boolean> = { '': true, none: true, '0': true };
    const currencyFields = ['compensation_amount'];

    if (!value || emptyEquivalents[value]) {
        if (currencyFields.includes(field)) {
            return 'Rp 0';
        }

        return 'Kosong';
    }

    if (valueLabels[value]) {
        return valueLabels[value];
    }

    if (currencyFields.includes(field)) {
        const num = parseFloat(value);

        if (!isNaN(num)) {
            return formatPrice(num);
        }
    }

    return value;
};

// Sub-components
function StatusLogItem({ log }: { log: AccidentStatusLog }) {
    return (
        <div className="group relative flex flex-col gap-3 rounded-xl border border-muted bg-card p-4 text-sm transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
            {/* Header: Event & Time */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <History className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-foreground">Perubahan Status</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>
                        {formatDate(log.created_at)} {formatTime(log.created_at)}
                    </span>
                </div>
            </div>

            {/* Body: Status badges */}
            <div className="flex flex-wrap items-center gap-2 pl-9">
                {log.from_status ? (
                    <>
                        <span className="inline-flex items-center rounded-full border border-muted-foreground/10 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {log.from_status.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/75" />
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {log.to_status.label}
                        </span>
                    </>
                ) : (
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Laporan Insiden Dibuat ({log.to_status.label})
                    </span>
                )}
            </div>

            {/* Footer: Actor */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-muted/40 pt-2 pl-9 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>
                        Diubah oleh: <span className="font-semibold text-foreground">{log.user?.name ?? 'Sistem'}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

function FieldLogItem({ log }: { log: AccidentFieldLog }) {
    const oldValueFormatted = formatLogValue(log.field_name, log.old_value);
    const newValueFormatted = formatLogValue(log.field_name, log.new_value);

    return (
        <div className="group relative flex flex-col gap-3 rounded-xl border border-muted bg-card p-4 text-sm transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
            {/* Header: Event & Time */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <Edit2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-foreground">
                        Mengubah {fieldLabels[log.field_name] || log.field_name}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>
                        {formatDate(log.created_at)} {formatTime(log.created_at)}
                    </span>
                </div>
            </div>

            {/* Body: Comparison details */}
            <div className="flex flex-wrap items-center gap-2 pl-9">
                <span
                    className="inline-flex max-w-[200px] items-center truncate rounded border border-muted-foreground/10 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground/80 line-through sm:max-w-[300px]"
                    title={oldValueFormatted}
                >
                    {oldValueFormatted}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/75" />
                <span
                    className="inline-flex max-w-[200px] items-center truncate rounded border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary sm:max-w-[300px]"
                    title={newValueFormatted}
                >
                    {newValueFormatted}
                </span>
            </div>

            {/* Footer: Actor & Item */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-muted/40 pt-2 pl-9 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>
                        Diubah oleh: <span className="font-semibold text-foreground">{log.user?.name ?? 'Sistem'}</span>
                    </span>
                </div>
                <Activity mode={log.item ? 'visible' : 'hidden'}>
                    <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span>
                            Item Layanan: <span className="font-semibold text-foreground">{log.item?.name ?? '-'}</span>
                        </span>
                    </div>
                </Activity>
            </div>
        </div>
    );
}

// Main Component
export function AccidentTimelineHistory({ logs }: AccidentTimelineHistoryProps) {
    const statusLogs = logs.filter((log): log is AccidentStatusLog => log.field_name === 'status');
    const fieldLogs = logs.filter((log): log is AccidentFieldLog => log.field_name !== 'status');

    return (
        <div className="flex flex-col gap-6 border-t pt-6">
            {/* Section 1: Riwayat Perubahan Status */}
            <Activity mode={statusLogs.length ? 'visible' : 'hidden'}>
                <div className="flex flex-col gap-4">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <History className="h-3.5 w-3.5" />
                        Riwayat Perubahan Status
                    </h4>
                    <div className="flex max-h-[350px] flex-col gap-3 overflow-y-auto pr-1">
                        {statusLogs.map((log) => (
                            <StatusLogItem key={log.id} log={log} />
                        ))}
                    </div>
                </div>
            </Activity>

            {/* Section 2: Riwayat Perubahan Data */}
            <Activity mode={fieldLogs.length > 0 ? 'visible' : 'hidden'}>
                <div className="flex flex-col gap-4">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <Edit2 className="h-3.5 w-3.5" />
                        Riwayat Perubahan Data
                    </h4>
                    <div className="flex max-h-[350px] flex-col gap-3 overflow-y-auto pr-1">
                        {fieldLogs.map((log) => (
                            <FieldLogItem key={log.id} log={log} />
                        ))}
                    </div>
                </div>
            </Activity>
        </div>
    );
}
