import { Head, usePage } from '@inertiajs/react';
import type { LayananEditSectionProps } from '@/components/feature/layanan/edit/layanan-edit-section';
import { LayananEditSection } from '@/components/feature/layanan/edit/layanan-edit-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananEdit() {
    const { service } = usePage<LayananEditSectionProps>().props;

    const layananHref = layanan.index({
        query: service.outlet_id ? { outletIdSelected: service.outlet_id } : undefined,
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layananHref },
                { title: 'Edit Layanan', href: '' },
            ]}
        >
            <Head title="Edit Layanan" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananEditSection />
            </section>
        </AppLayout>
    );
}
