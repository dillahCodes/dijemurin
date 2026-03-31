import type { ServicePageProps } from '@/types/feature/layanan';
import { usePage } from '@inertiajs/react';
import { Activity } from 'react';
import { ServiceCard } from './service-card';
import { ServiceEmpty } from './service-empty';
import { ServiceHeader } from './service-header';
import { ServiceSearch } from './service-search';

export function ServiceSection() {
    const { services, filters } = usePage<ServicePageProps>().props;

    return (
        <div className="flex flex-col gap-6">
            <ServiceHeader />
            <ServiceSearch value={filters.search} />
            <Activity mode={!services.length ? 'visible' : 'hidden'}>
                <ServiceEmpty search={filters.search} />
            </Activity>
            z
            <Activity mode={services.length ? 'visible' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            id={service.id}
                            title={service.name}
                            description={service.description}
                        />
                    ))}
                </div>
            </Activity>
        </div>
    );
}
