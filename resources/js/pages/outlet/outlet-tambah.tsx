import { Head } from '@inertiajs/react';
import { OutletTambahSection } from '@/components/feature/outlet/tambah/outlet-tambah-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import outlet from '@/routes/outlet';

export default function OutletTambah() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: dashboard() },
                { title: 'Outlet', href: outlet.index() },
                { title: 'Tambah Outlet', href: '' },
            ]}
        >
            <Head title={`Tambah Outlet`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OutletTambahSection />
            </section>
        </AppLayout>
    );
}
