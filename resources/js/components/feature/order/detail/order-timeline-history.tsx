import { User, ArrowRight } from 'lucide-react';
import { Activity } from 'react';
import { formatDate, formatTime } from '@/helper/formatted-date';
import type { OrderStatusLog } from '@/types/feature/order/order';

interface OrderTimelineHistoryProps {
    logs: OrderStatusLog[];
}

export function OrderTimelineHistory({ logs }: OrderTimelineHistoryProps) {
    return (
        <div className="flex flex-col gap-4 border-t pt-6">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Riwayat Perubahan Status
            </h4>
            <div className="flex flex-col gap-3">
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="flex items-start gap-3 rounded-lg border bg-muted/10 p-3 text-sm transition-colors hover:bg-muted/20"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="font-medium text-foreground">
                                    <Activity mode={log.from_status ? 'visible' : 'hidden'}>
                                        <span className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-muted-foreground">{log.from_status?.label}</span>
                                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            <span className="font-semibold text-primary">{log.to_status.label}</span>
                                        </span>
                                    </Activity>
                                    <Activity mode={log.from_status ? 'hidden' : 'visible'}>
                                        <span>
                                            Pesanan Dibuat (
                                            <span className="font-semibold text-primary">{log.to_status.label}</span>)
                                        </span>
                                    </Activity>
                                </div>
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>Diubah oleh:</span>
                                    <span className="font-medium text-foreground">{log.user?.name ?? 'Sistem'}</span>
                                </div>
                            </div>
                            <span className="shrink-0 self-start text-xs text-muted-foreground sm:self-center">
                                {formatDate(log.created_at)} {formatTime(log.created_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
