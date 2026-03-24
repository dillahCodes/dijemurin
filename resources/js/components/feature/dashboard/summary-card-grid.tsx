import {
    CheckCircle2,
    DollarSign,
    LoaderCircle,
    ShoppingBag,
} from 'lucide-react';
import SummaryCard from '@/components/features/dashboard/summary-card';

const CARD_DATA = [
    {
        title: 'Pendapatan hari ini',
        count: 154000,
        icon: DollarSign,
        type: 'currency' as const,
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
        accentColor: 'bg-purple-600 dark:bg-purple-400',
    },
    {
        title: 'Order hari ini',
        count: 32,
        icon: ShoppingBag,
        type: 'number' as const,
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
        accentColor: 'bg-blue-600 dark:bg-blue-400',
    },
    {
        title: 'Sedang diproses',
        count: 12,
        icon: LoaderCircle,
        type: 'number' as const,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-600/10 dark:bg-yellow-400/10',
        accentColor: 'bg-yellow-600 dark:bg-yellow-400',
    },
    {
        title: 'Siap diambil',
        count: 8,
        icon: CheckCircle2,
        type: 'number' as const,
        iconColor: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-600/10 dark:bg-green-400/10',
        accentColor: 'bg-green-600 dark:bg-green-400',
    },
];

/**
 * main component
 */

export function SummaryCardGrid() {
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
                />
            ))}
        </div>
    );
}
