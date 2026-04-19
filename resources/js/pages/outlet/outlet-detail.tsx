import { Head, usePage } from '@inertiajs/react';
import type { OutletDetailPageProps } from '@/components/feature/outlet/detail/outlet-detail-section';
import { OutletDetailSection } from '@/components/feature/outlet/detail/outlet-detail-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import outlet from '@/routes/outlet';

export default function OutletDetail() {
    const { outletDetail } = usePage<OutletDetailPageProps>().props;
    const { data: outletDetailData } = outletDetail;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: dashboard() },
                { title: 'Outlet', href: outlet.index() },
                { title: `Detail Outlet ${outletDetailData.name}`, href: '' },
            ]}
        >
            <Head title={`Detail Outlet ${outletDetailData.name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OutletDetailSection />
            </section>
        </AppLayout>
    );
}
