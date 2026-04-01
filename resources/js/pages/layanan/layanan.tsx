import { Head } from '@inertiajs/react';
import { ServiceSection } from '@/components/feature/layanan/service-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function ServicesIndex() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Layanan', href: layanan.index() }]}>
            <Head title="Layanan" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <ServiceSection />
            </section>
        </AppLayout>
    );
}
