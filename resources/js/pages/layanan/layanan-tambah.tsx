import { Head } from '@inertiajs/react';
import { LayananTambahSection } from '@/components/feature/layanan/tambah/layanan-tambah-section';
import { useCart } from '@/context/feature/cart/cart-context';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananTambah() {
    const { state } = useCart();

    const layananHref = layanan.index({
        query: state.outlet_id ? { outletIdSelected: state.outlet_id } : undefined,
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layananHref },
                { title: 'Tambah Layanan', href: '' },
            ]}
        >
            <Head title="Tambah Layanan" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananTambahSection />
            </section>
        </AppLayout>
    );
}
