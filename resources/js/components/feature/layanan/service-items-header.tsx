import type { Service } from '@/types/feature/layanan';

interface ServiceItemsHeaderProps {
    service: Service;
}

export function ServiceItemsHeader({ service }: ServiceItemsHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Price List {service.name}</h1>
            <p className="text-muted-foreground">{service.description}</p>
        </div>
    );
}
