import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Order, OrderTransitionRules } from '@/types/feature/order';
import { OrderOption } from '../order/order-data-section';
import { ChartsGrid } from './charts-grid';
import { RecentOrdersSection } from './recent-orders-section';
import { SummaryCardGrid } from './summary-card-grid';

export type DashboardSectionProps = {
    orders: LaravelPaginator<Order>;
    orderTransitionRules: OrderTransitionRules;
    orderStatusOptions: OrderOption[];

    todayRevenue: number;
    todayOrderCount: number;
    processOrderCount: number;
    doneOrderCount: number;
};

export function DashboardSection() {
    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <SummaryCardGrid />
            <ChartsGrid />
            <RecentOrdersSection />
        </section>
    );
}
