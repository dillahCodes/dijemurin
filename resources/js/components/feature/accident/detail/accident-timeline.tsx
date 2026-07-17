import { Check } from 'lucide-react';
import { Activity } from 'react';
import { AccidentTimelineHistory } from '@/components/feature/accident/detail/accident-timeline-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AccidentStatusEnglish   } from '@/types/feature/accident/accident';
import type {AccidentDetail, AccidentStatusLog} from '@/types/feature/accident/accident';

interface AccidentTimelineProps {
    accident: AccidentDetail;
}

export function AccidentTimeline({ accident }: AccidentTimelineProps) {
    const steps = [
        { key: 'pending', label: 'Menunggu Verifikasi' },
        { key: 'investigating', label: 'Dalam Penyelidikan' },
        { key: 'resolved', label: 'Selesai' },
    ];

    const hasRejected = [AccidentStatusEnglish.REJECTED].includes(accident.status.value);

    if (hasRejected) {
steps[2] = { key: 'rejected', label: 'Ditolak' };
}

    const currentStepIndex = steps.findIndex((s) => s.key === accident.status.value);
    const logs = accident.logs || [];

    const getLogForStep = (statusKey: string) => {
        const statusLogs = logs.filter((log): log is AccidentStatusLog => log.field_name === 'status');

        return statusLogs.find((log) => log.to_status.value === statusKey);
    };

    return (
        <Card className="overflow-hidden py-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Status Perjalanan Insiden</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8 p-6">
                <div className="relative flex w-full items-start justify-between">
                    <div
                        className="absolute top-4 z-0 h-[2px] bg-muted"
                        style={{
                            left: `calc(100% / (${steps.length} * 2))`,
                            right: `calc(100% / (${steps.length} * 2))`,
                        }}
                    />

                    <Activity mode={currentStepIndex > 0 ? 'visible' : 'hidden'}>
                        <div
                            className="absolute top-4 z-0 h-[2px] bg-primary transition-all duration-500"
                            style={{
                                left: `calc(100% / (${steps.length} * 2))`,
                                width: `calc(${currentStepIndex} * 100% / ${steps.length})`,
                            }}
                        />
                    </Activity>

                    {steps.map((step, idx) => {
                        const isStepCompleted = idx < currentStepIndex;
                        const isStepActive = idx === currentStepIndex;
                        const isStepPending = idx > currentStepIndex;
                        const log = getLogForStep(step.key);

                        return (
                            <div key={step.key} className="relative flex flex-1 flex-col items-center">
                                <div
                                    className={cn(
                                        'z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-all duration-300',
                                        isStepCompleted && 'border-primary bg-primary text-primary-foreground',
                                        isStepActive && 'border-primary font-bold text-primary ring-4 ring-primary/20',
                                        isStepPending && 'border-muted text-muted-foreground',
                                    )}
                                >
                                    <Activity mode={isStepCompleted ? 'visible' : 'hidden'}>
                                        <Check className="h-4 w-4" />
                                    </Activity>
                                    <Activity mode={isStepCompleted ? 'hidden' : 'visible'}>
                                        <span className="text-xs">{idx + 1}</span>
                                    </Activity>
                                </div>

                                <span
                                    className={cn(
                                        'mt-2 text-center text-xs font-medium',
                                        isStepActive && 'font-semibold text-primary',
                                        isStepPending && 'text-muted-foreground',
                                    )}
                                >
                                    {step.label}
                                </span>

                                <Activity mode={log ? 'visible' : 'hidden'}>
                                    <span className="mt-0.5 hidden text-center text-[10px] text-muted-foreground sm:block">
                                        {log?.user?.name || 'Sistem'}
                                    </span>
                                </Activity>
                            </div>
                        );
                    })}
                </div>

                <Activity mode={logs.length ? 'visible' : 'hidden'}>
                    <AccidentTimelineHistory logs={logs} />
                </Activity>
            </CardContent>
        </Card>
    );
}
