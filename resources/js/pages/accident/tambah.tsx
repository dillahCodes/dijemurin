import { Head } from '@inertiajs/react';
import { AccidentTambahSection } from '@/components/feature/accident/tambah/accident-tambah-section';
import AppLayout from '@/layouts/app-layout';
import accidents from '@/routes/accidents';

export default function AccidentTambah() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Laporan Insiden', href: accidents.index().url },
                { title: 'Laporkan Insiden', href: '' },
            ]}
        >
            <Head title="Laporkan Insiden" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <AccidentTambahSection />
            </section>
        </AppLayout>
    );
}
