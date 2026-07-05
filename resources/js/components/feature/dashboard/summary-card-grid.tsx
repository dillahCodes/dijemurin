import type { LucideIcon } from 'lucide-react';
import { Zap, BarChart3, Building2 } from 'lucide-react';
import { Activity } from 'react';
import SummaryCard from '@/components/feature/dashboard/summary-card';
import { useSummaryCardGrid } from '@/hooks/feature/dashboard/use-summary-card-grid';
import { cn } from '@/lib/utils';

interface CardData {
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

interface CardSectionProps {
    icon: LucideIcon;
    iconColor: string;
    label: string;
    cards: CardData[];
}

function CardSection({ icon: Icon, iconColor, label, cards }: CardSectionProps) {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <Icon className={cn('size-4', iconColor)} />
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                    <SummaryCard {...card} key={card.title} />
                ))}
            </div>
        </div>
    );
}

export function SummaryCardGrid() {
    const { actionCards, summaryCards, overviewCards } = useSummaryCardGrid();

    return (
        <div className="flex flex-col gap-6">
            <Activity mode={actionCards.length > 0 ? 'visible' : 'hidden'}>
                <CardSection icon={Zap} iconColor="text-amber-500" label="Perlu Tindakan" cards={actionCards} />
            </Activity>

            <Activity mode={summaryCards.length > 0 ? 'visible' : 'hidden'}>
                <CardSection icon={BarChart3} iconColor="text-blue-500" label="Ringkasan" cards={summaryCards} />
            </Activity>

            <Activity mode={overviewCards.length > 0 ? 'visible' : 'hidden'}>
                <CardSection icon={Building2} iconColor="text-slate-500" label="Manajemen" cards={overviewCards} />
            </Activity>
        </div>
    );
}
