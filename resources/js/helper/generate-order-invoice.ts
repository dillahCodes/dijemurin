import { EscPosStyling as S } from '@/helper/esc-pos-styling';
import type { OrderDetail } from '@/types/feature/order/order';
import concatBytes from './concat-byte';

// ============================================================================
// HELPER FUNCTIONS (Formatting & Logic)
// ============================================================================

function formatReceiptDate(dateString: string): string {
    const orderDate = new Date(dateString);

    return orderDate.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function truncateName(name: string, maxLength: number = 20): string {
    if (name.length <= maxLength) {
        return name;
    }

    return `${name.substring(0, maxLength - 3)}...`;
}

// ============================================================================
// RECEIPT SECTION BUILDERS
// ============================================================================

function buildHeader(orderDetail: OrderDetail): Uint8Array[] {
    return [
        S.align.center,

        S.bold.on,
        S.size.h2,
        S.text('POINT OF SALE DIJEMURIN.ID\n'),
        S.bold.off,
        S.size.normal,

        S.bold.on,
        S.size.normal,
        S.text(`${orderDetail.outlet?.name}\n`),
        S.bold.off,
        S.size.normal,

        S.text(`Telp: ${orderDetail.outlet?.phone}\n\n`),

        S.align.left,
        S.line(),
    ];
}

function buildOrderInfo(orderDetail: OrderDetail): Uint8Array[] {
    const customerName = truncateName(orderDetail.customer_name || 'Pelanggan');
    const formattedDate = formatReceiptDate(orderDetail.created_at);

    return [
        S.text(`No: ${orderDetail.order_code}\n`),
        S.text(`Kasir    : ${orderDetail.cashier.name}\n`),
        S.text(`Tanggal  : ${formattedDate}\n`),
        S.text(`Pelanggan: ${customerName}\n`),
        S.text(`Outlet   : ${orderDetail.outlet?.name}\n`),
        S.line(),
    ];
}

function buildItemList(items: OrderDetail['order_items']): Uint8Array[] {
    const parts: Uint8Array[] = [];

    items.forEach((item) => {
        parts.push(S.itemLine(item.item_name, `${item.quantity} ${item.unit}`, item.subtotal));
    });

    parts.push(S.line());

    return parts;
}

function buildPaymentSection(orderDetail: OrderDetail): Uint8Array[] {
    const parts: Uint8Array[] = [];

    parts.push(S.bold.on);
    parts.push(S.summaryLine('TOTAL', orderDetail.total_price));
    parts.push(S.bold.off);
    parts.push(S.line());

    const method = orderDetail.payment.method.toLowerCase();
    const isCash = method === 'cash' || method === 'tunai';

    if (isCash) {
        const cashAmount = orderDetail.payment.cash_payment_amount ?? 0;
        const changeAmount = orderDetail.payment.cash_change_amount ?? 0;

        parts.push(S.summaryLine('Bayar (Tunai)', cashAmount));
        parts.push(S.summaryLine('Kembali', changeAmount));
    } else {
        const paymentMethodLabel = orderDetail.payment.method.toUpperCase();
        parts.push(S.summaryLine(`Bayar (${paymentMethodLabel})`, orderDetail.total_price));
    }

    parts.push(S.line());

    return parts;
}

function buildFooter(): Uint8Array[] {
    return [
        S.align.center,
        S.text('\nTerima kasih atas\n'),
        S.text('kunjungan Anda!\n'),
        S.text('================================\n\n\n'),
        S.align.left,
    ];
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function generateOrderInvoice(orderDetail: OrderDetail): Uint8Array {
    const parts: Uint8Array[] = [
        ...buildHeader(orderDetail),
        ...buildOrderInfo(orderDetail),
        ...buildItemList(orderDetail.order_items),
        ...buildPaymentSection(orderDetail),
        ...buildFooter(),
    ];

    return concatBytes(...parts);
}
