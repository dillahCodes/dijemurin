import { Head, usePage } from '@inertiajs/react';

import type { ServiceItemPageProps } from '@/components/feature/layanan/items/service-items-section';
import { ServiceItemsSection } from '@/components/feature/layanan/items/service-items-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananItemsIndex() {
    const { service } = usePage<ServiceItemPageProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layanan.index() },
                { title: `Price List ${service.name}`, href: layanan.items.index({ id: service.id }) },
            ]}
        >
            <Head title={`Price List ${service.name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <ServiceItemsSection />
            </section>
        </AppLayout>
    );
}
