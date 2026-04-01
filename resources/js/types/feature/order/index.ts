export interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    status: string;
    total_price: number;
    order_at: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
}
