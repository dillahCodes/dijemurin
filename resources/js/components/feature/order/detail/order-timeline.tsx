import { Check } from 'lucide-react';
import { Activity } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OrderStatusEnglish, OrderStatusIndonesian } from '@/types/feature/order/order';
import type { OrderDetail } from '@/types/feature/order/order';
import { OrderTimelineHistory } from './order-timeline-history';

interface OrderTimelineProps {
    order: OrderDetail;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
    const isCancelled = order.status.value === OrderStatusEnglish.CANCELLED;

    const steps = isCancelled
        ? [
              { key: OrderStatusEnglish.PENDING, label: OrderStatusIndonesian.PENDING },
              { key: OrderStatusEnglish.CANCELLED, label: OrderStatusIndonesian.CANCELLED },
          ]
        : [
              { key: OrderStatusEnglish.PENDING, label: OrderStatusIndonesian.PENDING },
              { key: OrderStatusEnglish.PROCESS, label: OrderStatusIndonesian.PROCESS },
              { key: OrderStatusEnglish.DONE, label: OrderStatusIndonesian.DONE },
              { key: OrderStatusEnglish.PICKED_UP, label: OrderStatusIndonesian.PICKED_UP },
          ];

    const currentStepIndex = steps.findIndex((s) => s.key === order.status.value);
    const logs = order.status_logs || [];

    const getLogForStep = (statusKey: string) => {
        return logs.find((log) => log.to_status.value === statusKey);
    };

    return (
        <Card className="overflow-hidden py-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Status Perjalanan Pesanan</CardTitle>
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
                        const isCompleted = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        const isPending = idx > currentStepIndex;
                        const log = getLogForStep(step.key);

                        return (
                            <div key={step.key} className="relative flex flex-1 flex-col items-center">
                                <div
                                    className={cn(
                                        'z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-all duration-300',
                                        isCompleted && 'border-primary bg-primary text-primary-foreground',
                                        isActive && 'border-primary font-bold text-primary ring-4 ring-primary/20',
                                        isPending && 'border-muted text-muted-foreground',
                                    )}
                                >
                                    <Activity mode={isCompleted ? 'visible' : 'hidden'}>
                                        <Check className="h-4 w-4" />
                                    </Activity>
                                    <Activity mode={isCompleted ? 'hidden' : 'visible'}>
                                        <span className="text-xs">{idx + 1}</span>
                                    </Activity>
                                </div>

                                <span
                                    className={cn(
                                        'mt-2 text-center text-xs font-medium',
                                        isActive && 'font-semibold text-primary',
                                        isPending && 'text-muted-foreground',
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

                <Activity mode={logs.length > 0 ? 'visible' : 'hidden'}>
                    <OrderTimelineHistory logs={logs} />
                </Activity>
            </CardContent>
        </Card>
    );
}
