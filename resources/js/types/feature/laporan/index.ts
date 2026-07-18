import type { OrderStatusIndonesian } from '../order/order';

// ─── Period ──────────────────────────────────────────────────────────────────
export interface ReportPeriod {
    start_date: string | null;
    end_date: string | null;
}

// ─── Top Level ────────────────────────────────────────────────────────────────
export interface ReportSummary {
    total_order: number;
    completed: number;
    cancelled: number;
}

export interface ReportTopServiceItem {
    item_name: string;
    total_qty: number;
    unit: string;
}

export interface ReportTopLevel {
    summary: ReportSummary;
    total_revenue: number;
    gross_revenue: number;
    accident_loss: number;
    net_revenue: number;
    payment_summary: Record<string, number>;
    top_services: ReportTopServiceItem[];
}

// ─── Middle Level ─────────────────────────────────────────────────────────────
export interface DailySummary {
    date: string;
    total_order: number;
    total_revenue: number;
    gross_revenue: number;
    accident_loss: number;
    net_revenue: number;
}

export interface ServiceSummaryItem {
    item_name: string;
    unit: string;
    total_qty: number;
    total_revenue: number;
}

export interface ReportMiddleLevel {
    daily_summary: DailySummary[];
    status_summary: Record<OrderStatusIndonesian, number>;
    payment_summary: Record<string, number>;
    service_summary: ServiceSummaryItem[];
}

// ─── First Level (raw transactions) ──────────────────────────────────────────
export interface ReportOrderItem {
    name: string;
    qty: number;
    unit: string;
    subtotal: number;
}

export interface ReportOrderPayment {
    method: string | null;
    paid: number | null;
    change: number | null;
}

export interface ReportOrder {
    customer_name: string;
    status: string;
    total_price: number;
    order_items: ReportOrderItem[];
    payment: ReportOrderPayment;
}

export interface ReportTransaction {
    date: string;
    orders: ReportOrder[];
}

export interface ReportFirstLevel {
    transactions: ReportTransaction[];
}

// ─── Full Report ──────────────────────────────────────────────────────────────
export interface Report {
    period: ReportPeriod;
    top_level: ReportTopLevel | null;
    middle_level: ReportMiddleLevel | null;
    first_level: ReportFirstLevel;
}

export interface ReportFilters {
    start_date?: string;
    end_date?: string;
}
