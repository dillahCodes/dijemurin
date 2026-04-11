import { Head } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';
import { OrderCustomerStatusSection } from '@/components/feature/order/customer-status/order-customer-status-section';

export default function OrderCustomerStatus() {
    return (
        <Fragment>
            <Head title={`Status Order`} />
            <section className="flex min-h-dvh w-full flex-col items-center justify-center p-4">
                <OrderCustomerStatusSection />
            </section>
        </Fragment>
    );
}
