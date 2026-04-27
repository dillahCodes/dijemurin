import type { Service, ServiceItem } from '@/types/feature/layanan';
import { LayananItemEditForm } from './layanan-item-edit-form';
import { LayananItemEditHeader } from './layanan-item-edit-header';

export type LayananItemEditSectionProps = {
    service: Service;
    serviceItem: ServiceItem;
};

export function LayananItemEditSection() {
    return (
        <div className="flex flex-col gap-6">
            <LayananItemEditHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <LayananItemEditForm />
            </div>
        </div>
    );
}
