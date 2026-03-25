import { ServiceSection } from '@/components/feature/layanan/service-section';
import AppLayout from '@/layouts/app-layout';
import { Service } from '@/types/feature/layanan';
import { Head } from '@inertiajs/react';

interface Props {
    services: Service[];
    filters: { search: string };
}

export default function ServicesIndex({ services, filters }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Services', href: '/services' }]}>
            <Head title="Services" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <ServiceSection services={services} filters={filters} />
            </section>
        </AppLayout>
    );
}
