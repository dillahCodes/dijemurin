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
