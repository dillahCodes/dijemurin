import { Activity } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OrderDetail } from '@/types/feature/order/order';

interface OrderCustomerStatusPaymentProps {
    order: OrderDetail;
}

export function OrderCustomerStatusPayment({ order }: OrderCustomerStatusPaymentProps) {
    const { payment, total_price } = order;

    const isCashPayment = Boolean(payment && payment.method === 'cash');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                    <span className="font-medium capitalize">{payment?.method?.replace('_', ' ')}</span>
                </div>

                <Activity mode={isCashPayment ? 'visible' : 'hidden'}>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Jumlah Pembayaran Tunai</span>
                        <span className="font-medium">Rp {payment?.cash_payment_amount?.toLocaleString('id-ID') || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Kembalian</span>
                        <span className="font-medium">Rp {payment?.cash_change_amount?.toLocaleString('id-ID') || 0}</span>
                    </div>
                </Activity>

                <Separator />

                <div className="flex justify-between">
                    <span className="font-semibold">Total Harga</span>
                    <span className="text-lg font-bold">Rp {total_price.toLocaleString('id-ID')}</span>
                </div>
            </CardContent>
        </Card>
    );
}
