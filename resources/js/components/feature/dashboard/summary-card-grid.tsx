import { usePage } from '@inertiajs/react';
import { CheckCircle2, DollarSign, LoaderCircle, ShoppingBag } from 'lucide-react';
import SummaryCard from '@/components/feature/dashboard/summary-card';
import order from '@/routes/order';
import { OrderStatusEnglish } from '@/types/feature/order';
import type { DashboardSectionProps } from './dashboard-section';

const filterDate = {
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
};

/**
 * main component
 */

export function SummaryCardGrid() {
    const { todayRevenue, todayOrderCount, processOrderCount, doneOrderCount } = usePage<DashboardSectionProps>().props;
    const CARD_DATA = [
        {
            title: 'Pendapatan hari ini',
            count: todayRevenue,
            icon: DollarSign,
            type: 'currency' as const,
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
            accentColor: 'bg-purple-600 dark:bg-purple-400',
        },
        {
            title: 'Orderan hari ini',
            href: order.index().url + `?end_date=${filterDate.end_date}&start_date=${filterDate.start_date}`,
            count: todayOrderCount,
            icon: ShoppingBag,
            type: 'number' as const,
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
            accentColor: 'bg-blue-600 dark:bg-blue-400',
        },
        {
            title: 'Sedang diproses',
            count: processOrderCount,
            href: order.index().url + `?status=${OrderStatusEnglish.PROCESS}`,
            icon: LoaderCircle,
            type: 'number' as const,
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            iconBg: 'bg-yellow-600/10 dark:bg-yellow-400/10',
            accentColor: 'bg-yellow-600 dark:bg-yellow-400',
        },
        {
            title: 'Siap diambil',
            count: doneOrderCount,
            href: order.index().url + `?status=${OrderStatusEnglish.DONE}`,
            icon: CheckCircle2,
            type: 'number' as const,
            iconColor: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-600/10 dark:bg-green-400/10',
            accentColor: 'bg-green-600 dark:bg-green-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARD_DATA.map((card, index) => (
                <SummaryCard
                    key={index}
                    title={card.title}
                    count={card.count}
                    type={card.type}
                    icon={card.icon}
                    iconColor={card.iconColor}
                    iconBg={card.iconBg}
                    accentColor={card.accentColor}
                    href={card.href}
                />
            ))}
        </div>
    );
}
