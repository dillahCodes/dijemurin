import { Head, usePage } from '@inertiajs/react';
import type { OrderDetailPageProps } from '@/components/feature/order/detail/order-detail-section';
import { OrderDetailSection } from '@/components/feature/order/detail/order-detail-section';
import AppLayout from '@/layouts/app-layout';
import order from '@/routes/order';

export default function OrderDetail() {
    const { detailOrder } = usePage<OrderDetailPageProps>().props;
    const { data: orderData } = detailOrder;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Order', href: order.index() },
                { title: `Detail Order ${orderData.customer_name}`, href: '' },
            ]}
        >
            <Head title={`Detail Order ${orderData.customer_name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OrderDetailSection />
            </section>
        </AppLayout>
    );
}
