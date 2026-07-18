import { BarChart3, Building2, Zap } from 'lucide-react';
import { Activity } from 'react';
import { useSummaryCardGrid } from '@/hooks/feature/dashboard/use-summary-card-grid';
import { Greeting } from '../greeting';
import SummaryCard from '../summary-card';
import { SuperAdminChartsGrid } from './superadmin-charts-grid';

export function SuperAdminDashboardSection() {
    const { actionCards, summaryCards, overviewCards } = useSummaryCardGrid();

    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <Greeting />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                <div className="flex flex-col gap-6 lg:col-span-5">
                    <Activity mode={summaryCards.length > 0 ? 'visible' : 'hidden'}>
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <BarChart3 className="size-4 text-blue-500" />
                                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    Ringkasan
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {summaryCards.map((card) => (
                                    <SummaryCard {...card} key={card.title} />
                                ))}
                            </div>
                        </div>
                    </Activity>
                    <SuperAdminChartsGrid />
                </div>

                <div className="flex flex-col gap-6 lg:col-span-2">
                    <Activity mode={actionCards.length > 0 ? 'visible' : 'hidden'}>
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Zap className="size-4 text-amber-500" />
                                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    Perlu Tindakan
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {actionCards.map((card) => (
                                    <SummaryCard {...card} key={card.title} />
                                ))}
                            </div>
                        </div>
                    </Activity>

                    <Activity mode={overviewCards.length > 0 ? 'visible' : 'hidden'}>
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Building2 className="size-4 text-slate-500" />
                                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    Manajemen
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {overviewCards.map((card) => (
                                    <SummaryCard {...card} key={card.title} />
                                ))}
                            </div>
                        </div>
                    </Activity>
                </div>
            </div>
        </section>
    );
}
