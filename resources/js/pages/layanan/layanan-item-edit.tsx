import { Head, usePage } from '@inertiajs/react';
import type { LayananItemEditSectionProps } from '@/components/feature/layanan/items/edit/layanan-item-edit-section';
import { LayananItemEditSection } from '@/components/feature/layanan/items/edit/layanan-item-edit-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananItemEdit() {
    const { service } = usePage<LayananItemEditSectionProps>().props;

    const layananHref = layanan.index({
        query: service.outlet_id ? { outletIdSelected: service.outlet_id } : undefined,
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layananHref },
                { title: `Price List ${service.name}`, href: layanan.items.index({ id: service.id }) },
                { title: 'Edit Price List', href: '' },
            ]}
        >
            <Head title={`Edit Price List ${service.name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananItemEditSection />
            </section>
        </AppLayout>
    );
}
