import { router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Activity } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/helper/formatted-price';
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
    description?: string;
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
    description,
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
                'group relative w-full overflow-hidden border-sidebar-border/70 p-0! shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-sidebar-border',
                className,
                {
                    'cursor-pointer': !!href,
                },
            )}
            {...props}
        >
            <div
                className={cn(
                    'absolute -top-8 -right-8 size-32 rounded-full opacity-40 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-60',
                    iconBg,
                )}
            />
            <CardContent className="relative z-10 flex items-center gap-3.5 p-4">
                <div
                    className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105',
                        iconBg,
                    )}
                >
                    <Icon className={cn('size-5', iconColor)} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors duration-300 group-hover:text-foreground/80">
                        {title}
                    </span>
                    <span className="mt-0.5 truncate text-xl font-bold tracking-tight text-foreground">
                        {type === 'currency' ? formatPrice(count as number) : count}
                    </span>
                    <Activity mode={description ? 'visible' : 'hidden'}>
                        <span className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{description}</span>
                    </Activity>
                </div>
            </CardContent>
            <div
                className={cn(
                    'absolute bottom-0 left-0 h-0.5 w-0 flex-none transition-all duration-500 ease-out group-hover:w-full',
                    accentColor,
                )}
            />
        </Card>
    );
}
