export interface Service {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ServiceItem {
    id: number;

    name: string;
    description: string;
    time: string;
    price: number;
    unit: string;

    service_id: number;

    created_at: string;
    updated_at: string;
}

export type ServicePageProps = {
    services: Service[];
    filters: { search: string };
};

export type ServiceItemPageProps = {
    service: Service;
    items: ServiceItem[];
    filters: { search: string };
};
