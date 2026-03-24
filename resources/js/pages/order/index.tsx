import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { OrderDataSection } from '@/components/pages/order/order-data-section';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Order', href: '/order' },
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
