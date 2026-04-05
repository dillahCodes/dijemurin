import { router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    count: number | string;
    type?: 'number' | 'currency';
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    accentColor?: string;
    href?: string;
}

export default function SummaryCard({
    title,
    count,
    icon: Icon,
    type = 'number',
    iconColor = 'text-primary',
    iconBg = 'bg-primary/10',
    accentColor = 'bg-primary',
    className,
    href,
    ...props
}: SummaryCardProps) {
    const handleClick = () => {
        if (href) {
            router.get(href);
        }
    };

    return (
        <Card
            onClick={handleClick}
            className={cn(
                'group relative w-full overflow-hidden border-sidebar-border/70 p-0! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
                className,
                {
                    'cursor-pointer': !!href,
                },
            )}
            {...props}
        >
            <div
                className={cn(
                    'absolute -top-8 -right-8 size-32 rounded-full opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70',
                    iconBg,
                )}
            />
            <CardContent className="relative z-10 flex h-full flex-col justify-between p-6">
                <div className="flex flex-col gap-4">
                    <div className={cn('flex size-12 items-center justify-center rounded-xl', iconBg)}>
                        <Icon className={cn('size-6', iconColor)} />
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {title}
                    </span>
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                        {type === 'currency'
                            ? new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                              }).format(count as number)
                            : count}
                    </span>
                </div>
            </CardContent>
            <div
                className={cn(
                    'absolute bottom-0 left-0 h-1 w-0 flex-none transition-all duration-500 ease-out group-hover:w-full',
                    accentColor,
                )}
            />
        </Card>
    );
}
