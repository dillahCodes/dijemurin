import { Activity } from 'react';

import type { Service, ServiceItem } from '@/types/feature/layanan';

import { ServiceItemCard } from './service-items-card';
import { ServiceItemsEmpty } from './service-items-empty';
import { ServiceItemsHeader } from './service-items-header';
import { ServiceItemsSearch } from './service-items-search';

interface Props {
    service: Service;
    items: ServiceItem[];
    filters: { search: string };
}

export function ServiceItemsSection({
    service,
    items,
    filters = { search: '' },
}: Props) {
    return (
        <div className="flex flex-col gap-6">
            <ServiceItemsHeader service={service} />
            <ServiceItemsSearch
                value={filters.search}
                serviceName={service.name}
                serviceId={service.id}
            />

            <Activity mode={!items.length ? 'visible' : 'hidden'}>
                <ServiceItemsEmpty search={filters.search} />
            </Activity>

            <Activity mode={items.length ? 'visible' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                        <ServiceItemCard
                            key={item.id}
                            serviceId={service.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            unit={item.unit}
                            time={item.time}
                        />
                    ))}
                </div>
            </Activity>
        </div>
    );
}
