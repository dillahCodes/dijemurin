import { Activity } from 'react';
import { formatDate } from '@/helper/formatted-date';
import { useOrderPrintReceipt } from '@/hooks/feature/order/use-order-print-receipt';
import type { OrderDetail } from '@/types/feature/order';

interface OrderPrintReceiptProps {
    order: OrderDetail;
}

interface DotRowProps {
    label: string;
    value: string;
    bold?: boolean;
}

function DotRow({ label, value, bold = false }: DotRowProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: bold ? 'bold' : 'normal',
                gap: '4px',
            }}
        >
            <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
            <span
                style={{
                    flex: 1,
                    borderBottom: '1px dotted #000',
                    margin: '0 4px 3px',
                }}
            />
            <span style={{ whiteSpace: 'nowrap' }}>{value}</span>
        </div>
    );
}

function Divider() {
    return <hr style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />;
}

export function OrderPrintReceiptSection({ order }: OrderPrintReceiptProps) {
    const { order_code, customer_name, order_at, order_items, payment, total_price } = order;
    const { isCashPayment } = useOrderPrintReceipt(order);

    return (
        <div className="hidden print:block">
            <div
                style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '10px',
                    margin: '0 auto',
                    padding: '8px',
                    width: '58mm',
                    boxSizing: 'border-box',
                }}
            >
                {/* Header */}
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>NAMA TOKO</p>
                    <p style={{ textAlign: 'center' }}>Jl. Contoh Alamat No. 123</p>
                    <p style={{ textAlign: 'center' }}>Telp: 021-1234567</p>
                </div>

                <Divider />

                {/* Info Pesanan */}
                <div>
                    <p>No. Pesanan : {order_code}</p>
                    <p>Pelanggan : {customer_name}</p>
                    <p>Tanggal : {formatDate(order_at)}</p>
                </div>

                <Divider />

                {/* Daftar Item */}
                <div>
                    {order_items.map((item) => (
                        <div key={item.id} style={{ marginBottom: '4px' }}>
                            <p>
                                {item.quantity} {item.unit} x {item.item_name}
                            </p>
                            <DotRow label="Subtotal" value={`Rp ${item.subtotal.toLocaleString('id-ID')}`} />
                        </div>
                    ))}
                </div>

                <Divider />

                {/* Total */}
                <DotRow label="TOTAL" value={`Rp ${total_price.toLocaleString('id-ID')}`} bold />

                {/* Pembayaran */}
                <Activity mode={payment ? 'visible' : 'hidden'}>
                    <Divider />
                    <p>Metode : {payment?.method?.replace('_', ' ').toUpperCase()}</p>

                    <Activity mode={isCashPayment ? 'visible' : 'hidden'}>
                        <DotRow label="Tunai" value={`Rp ${payment?.cash_payment_amount?.toLocaleString('id-ID') ?? 0}`} />
                        <DotRow
                            label="Kembalian"
                            value={`Rp ${payment?.cash_change_amount?.toLocaleString('id-ID') ?? 0}`}
                        />
                    </Activity>
                </Activity>

                <Divider />

                {/* Footer */}
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>TERIMA KASIH ATAS PESANAN ANDA!</p>
                    <p style={{ textAlign: 'center' }}>Selamat menikmati :)</p>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @media print {
                            @page {
                                size: 58mm auto;
                                margin: 0;
                            }

                            body {
                                margin: 0;
                                padding: 0;
                            }

                            * {
                                box-sizing: border-box;
                            }
                        }
                    `,
                }}
            />
        </div>
    );
}
