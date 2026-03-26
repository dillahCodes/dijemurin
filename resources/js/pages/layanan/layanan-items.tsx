import { Head } from '@inertiajs/react';

import { ServiceItemsSection } from '@/components/feature/layanan/service-items-section';
import AppLayout from '@/layouts/app-layout';
import type { Service, ServiceItem } from '@/types/feature/layanan';

interface Props {
    service: Service;
    items: ServiceItem[];
    filters: { search: string };
}

export default function LayananItemsIndex({ service, items, filters }: Props) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: '/layanan' },
                {
                    title: `Price List ${service.name}`,
                    href: `/layanan/${service.id}`,
                },
            ]}
        >
            <Head title={`Price List ${service.name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <ServiceItemsSection filters={filters} service={service} items={items} />
            </section>
        </AppLayout>
    );
}
