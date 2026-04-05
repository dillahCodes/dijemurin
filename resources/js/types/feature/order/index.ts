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

export interface OrderDetail extends Omit<Order, 'order_items' | 'payment' | 'payment_method'> {
    order_items: OrderItem[];
    payment: Payment;
}

export interface OrderItem {
    id: number;
    item_name: string;
    item_price: number;
    unit: string;
    quantity: number;
    subtotal: number;
}

export interface Payment {
    id: number;
    method: string;
    cash_payment_amount: number | null;
    cash_change_amount: number | null;
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

export type OrderTransitionRules = Record<OrderStatusEnglish, OrderStatusEnglish[]>;
