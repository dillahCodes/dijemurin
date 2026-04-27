import { usePage } from '@inertiajs/react';
import { Activity } from 'react';
import { RoleHelper } from '@/helper/role-helper';
import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Service } from '@/types/feature/layanan';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import type { ApiResponse } from '@/types/response';
import { ServiceCard } from './service-card';
import { ServiceEmpty } from './service-empty';
import { ServiceHeader } from './service-header';
import { ServicePagination } from './service-pagination';
import { ServiceSearch } from './service-search';

export type ServicePageProps = {
    services: LaravelPaginator<Service>;
    filters: { search?: string; outletSearch?: string; outletIdSelected?: number };
    outlets?: LaravelPaginator<Outlet>;
    outletSelected?: ApiResponse<Outlet>;
};

export function ServiceSection() {
    const { services, filters, auth } = usePage<ServicePageProps>().props;
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <div className="flex flex-col gap-6">
            <ServiceHeader />
            <ServiceSearch />

            <Activity mode={!services.data.length ? 'visible' : 'hidden'}>
                <ServiceEmpty search={filters.search} />
            </Activity>

            <Activity mode={services.data.length ? 'visible' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {services.data.map((service) => (
                        <ServiceCard key={service.id} {...service} />
                    ))}
                </div>
            </Activity>

            {hasSuperAdmin && <ServicePagination />}
        </div>
    );
}
