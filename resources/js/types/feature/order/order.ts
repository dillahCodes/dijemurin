import type { Outlet } from '../outlet/outlet';
import type { User, UserRole } from '../user/user';

export interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    status: { label: OrderStatusIndonesian; value: OrderStatusEnglish };
    total_price: number;
    created_at: string;
    updated_at: string;
    estimated_completed_at?: string | null;
    payment_method: string;
    outlet: Pick<Outlet, 'id' | 'name'>;
}

export interface OrderStatusLog {
    id: number;
    order_id: number;
    user: Pick<User, 'id' | 'name'> | null;
    from_status: { label: OrderStatusIndonesian; value: OrderStatusEnglish } | null;
    to_status: { label: OrderStatusIndonesian; value: OrderStatusEnglish };
    created_at: string;
}

export interface OrderDetail extends Omit<Order, 'order_items' | 'payment' | 'payment_method'> {
    order_items: OrderItem[];
    payment: Payment;
    outlet: Pick<Outlet, 'id' | 'name' | 'phone' | 'email' | 'address'>;
    cashier: Pick<User, 'id' | 'name'>;
    status_logs?: OrderStatusLog[];
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

export type OrderTransitionRules = Record<UserRole, Record<OrderStatusEnglish, OrderStatusEnglish[]>>;

export enum OrderTimeStatusEnglish {
    ALMOST_OVERDUE = 'almost_overdue',
    OVERDUE = 'overdue',
}

export enum OrderTimeStatusIndonesian {
    ALMOST_OVERDUE = 'Hampir Terlambat',
    OVERDUE = 'Terlambat',
}

export enum OrderDateTypeEnglish {
    ORDER_CREATED = 'order_created',
    STATUS_CHANGED = 'status_changed',
}

export enum OrderDateTypeIndonesian {
    ORDER_CREATED = 'Pesanan Dibuat',
    STATUS_CHANGED = 'Status Diubah',
}
