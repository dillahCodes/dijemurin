export interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    status: { label: OrderStatusIndonesian; value: OrderStatusEnglish };
    total_price: number;
    order_at: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
}

export enum OrderStatusIndonesian {
    PENDING = 'Menunggu',
    PROCESS = 'Diproses',
    DONE = 'Selesai',
    PICKED_UP = 'Diambil',
    CANCELLED = 'Dibatalkan',
}

export enum OrderStatusEnglish {
    PENDING = 'pending',
    PROCESS = 'process',
    DONE = 'done',
    PICKED_UP = 'picked up',
    CANCELLED = 'cancelled',
}
