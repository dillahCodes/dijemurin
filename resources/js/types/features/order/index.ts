export interface Order {
    id: string;
    customer: string;
    service: string;
    status: 'Selesai' | 'Diproses' | 'Pending' | 'Batal';
    date: string;
    amount: number;
}
