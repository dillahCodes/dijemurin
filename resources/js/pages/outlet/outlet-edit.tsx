import { OutletEditSection } from '@/components/feature/outlet/edit/outlet-edit-section';
import { OutletTambahSection } from '@/components/feature/outlet/tambah/outlet-tambah-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import outlet from '@/routes/outlet';
import { Head } from '@inertiajs/react';

export default function OutletEdit() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: dashboard() },
                { title: 'Outlet', href: outlet.index() },
                { title: 'Edit Outlet', href: '' },
            ]}
        >
            <Head title={`Edit Outlet`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OutletEditSection />
            </section>
        </AppLayout>
    );
}
