import type { Service } from '@/types/feature/layanan';

interface ServiceItemsHeaderProps {
    service: Service;
}

export function ServiceItemsHeader({ service }: ServiceItemsHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">
                Price List {service.name}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base md:text-lg">{service.description}</p>
        </div>
    );
}
