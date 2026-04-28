import { Head } from '@inertiajs/react';
import { OrderDataSection } from '@/components/feature/order/order-data-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import order from '@/routes/order';
import type { BreadcrumbItem } from '@/types';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Order', href: order.index() },
];

export default function OrderIndex() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Order" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OrderDataSection />
            </section>
        </AppLayout>
    );
}
