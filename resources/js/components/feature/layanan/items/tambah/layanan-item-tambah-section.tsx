import type { Service } from '@/types/feature/layanan';
import { LayananItemTambahForm } from './layanan-item-tambah-form';
import { LayananItemTambahHeader } from './layanan-item-tambah-header';

export type LayananItemTambahSectionProps = {
    service: Service;
};

export function LayananItemTambahSection() {
    return (
        <div className="flex flex-col gap-6">
            <LayananItemTambahHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <LayananItemTambahForm />
            </div>
        </div>
    );
}
