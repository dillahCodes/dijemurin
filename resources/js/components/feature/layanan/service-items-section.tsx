import { Activity, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Service, ServiceItem } from '@/types/feature/layanan';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

// 1. Local Types
interface ServiceItemCardProps {
    name: string;
    description: string;
    price: number;
    unit: string;
    time: string;
}

interface ServiceItemsEmptyProps {
    serviceName: string;
}

// 2. Sub-components
function ServiceItemsHeader({ service }: { service: Service }) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
                Price List {service.name}
            </h1>
            <p className="text-muted-foreground">{service.description}</p>
        </div>
    );
}

interface SearchProps {
    serviceName: string;
    serviceId: number;
    value: string;
}

function ServiceItemsSearch({ serviceName, value, serviceId }: SearchProps) {
    const [search, setSearch] = useState(value);
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchParam = { search: search || undefined };
        router.get(`/layanan/${serviceId}`, searchParam, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get(`/layanan/${serviceId}`, {}, options);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex max-w-2xl items-center gap-3"
        >
            <Input
                type="text"
                placeholder={`Cari Price List ${serviceName}...`}
                name="search"
                value={search}
                onChange={handleChange}
            />
            <div className="flex items-center gap-3">
                <Activity mode={search ? 'visible' : 'hidden'}>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer"
                    >
                        <X size={16} />
                    </Button>
                </Activity>
                <Button type="submit" className="cursor-pointer">
                    Cari
                </Button>
            </div>
        </form>
    );
}

function ServiceItemCard({
    name,
    description,
    price,
    unit,
    time,
}: ServiceItemCardProps) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);

    return (
        <Card
            className={cn(
                'group relative w-full overflow-hidden border-sidebar-border/70 p-0! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
            )}
        >
            {/* Blur orb */}
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

            <CardContent className="relative z-10 flex h-full flex-col justify-between gap-4 p-6">
                {/* Top: name + description */}
                <CardHeader className="p-0!">
                    <CardTitle className="line-clamp-1 text-base">
                        {name}
                    </CardTitle>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                        {description}
                    </p>
                </CardHeader>

                {/* Bottom: price + meta */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            {formattedPrice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            per {unit}
                        </span>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {time}
                    </span>
                </div>
            </CardContent>

            {/* Accent bar */}
            <div className="absolute bottom-0 left-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
        </Card>
    );
}

function ServiceItemsEmpty({ serviceName }: ServiceItemsEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-bold text-muted-foreground">
                    {serviceName.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                    Belum ada item
                </p>
                <p className="text-xs text-muted-foreground">
                    Layanan{' '}
                    <span className="font-medium text-foreground">
                        {serviceName}
                    </span>{' '}
                    belum memiliki item tersedia.
                </p>
            </div>
        </div>
    );
}

// 3. Main Component
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
                <ServiceItemsEmpty serviceName={service.name} />
            </Activity>

            <Activity mode={items.length ? 'visible' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                        <ServiceItemCard
                            key={item.id}
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
