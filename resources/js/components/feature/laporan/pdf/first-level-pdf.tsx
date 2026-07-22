import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ReportFirstLevel, ReportPeriod } from '@/types/feature/laporan';
import { shared, colors, formatRupiah, formatDate } from './pdf-styles';

interface Props {
    period: ReportPeriod;
    data: ReportFirstLevel;
}

export function FirstLevelPdf({ period, data }: Props) {
    const { transactions } = data;

    if (transactions.length === 0) {
        return (
            <Document title="Laporan Detail Transaksi" author="Sistem Laundry">
                <Page size="A4" style={shared.page}>
                    {/* Header */}
                    <View style={shared.headerRow}>
                        <View>
                            <Text style={shared.headerTitle}>Laporan Detail Transaksi</Text>
                            <Text style={shared.headerSubtitle}>Rincian per transaksi harian</Text>
                        </View>
                        <View style={shared.periodBadge}>
                            <Text style={shared.periodLabel}>Periode</Text>
                            <Text style={shared.periodValue}>
                                {formatDate(period.start_date)} – {formatDate(period.end_date)}
                            </Text>
                        </View>
                    </View>

                    {/* Empty State Message */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ fontSize: 11, color: colors.secondary, fontFamily: 'Helvetica-Bold' }}>
                            Tidak ada transaksi pada periode ini
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={shared.footer} fixed>
                        <Text style={shared.footerText}>Laporan Detail Transaksi — Sistem Laundry</Text>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <Document title="Laporan Detail Transaksi" author="Sistem Laundry">
            {transactions.map((trx) => (
                <Page key={trx.date} size="A4" style={shared.page}>
                    {/* Header */}
                    <View style={shared.headerRow}>
                        <View>
                            <Text style={shared.headerTitle}>Laporan Detail Transaksi</Text>
                            <Text style={shared.headerSubtitle}>Rincian per transaksi harian</Text>
                        </View>
                        <View style={shared.periodBadge}>
                            <Text style={shared.periodLabel}>Periode</Text>
                            <Text style={shared.periodValue}>
                                {formatDate(period.start_date)} – {formatDate(period.end_date)}
                            </Text>
                        </View>
                    </View>

                    {/* Date section title */}
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[shared.sectionTitle, { fontSize: 12 }]}>Tanggal: {formatDate(trx.date)}</Text>
                    </View>

                    {/* Orders */}
                    {trx.orders.map((order, oi) => (
                        <View key={oi} style={{ marginBottom: 14 }} wrap={false}>
                            {/* Order header bar */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: colors.bg,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: 4,
                                    padding: 7,
                                    marginBottom: 4,
                                }}
                            >
                                <Text style={[shared.tdText, { fontFamily: 'Helvetica-Bold' }]}>{order.customer_name}</Text>
                                <Text style={[shared.tdText, { color: colors.secondary }]}>{order.status}</Text>
                                <Text style={[shared.tdText, { fontFamily: 'Helvetica-Bold' }]}>
                                    {formatRupiah(order.total_price)}
                                </Text>
                            </View>

                            {/* Order items table */}
                            <View style={[shared.table, { paddingLeft: 8 }]}>
                                <View style={shared.tableHeader}>
                                    <Text style={[shared.thText, { flex: 4 }]}>Layanan</Text>
                                    <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Qty</Text>
                                    <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Sat</Text>
                                    <Text style={[shared.thText, { flex: 2, textAlign: 'right' }]}>Subtotal</Text>
                                </View>
                                {order.order_items.map((item, ii) => (
                                    <View key={ii} style={[shared.tableRow, ii % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                        <Text style={[shared.tdText, { flex: 4 }]}>{item.name}</Text>
                                        <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{item.qty}</Text>
                                        <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{item.unit}</Text>
                                        <Text style={[shared.tdText, { flex: 2, textAlign: 'right' }]}>
                                            {formatRupiah(item.subtotal)}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Payment info */}
                            {order.payment.method && (
                                <View style={{ paddingLeft: 8, marginTop: 4, flexDirection: 'row', gap: 16 }}>
                                    <Text style={[shared.footerText, { color: colors.secondary }]}>
                                        Pembayaran:{' '}
                                        <Text style={{ fontFamily: 'Helvetica-Bold', textTransform: 'capitalize' }}>
                                            {order.payment.method}
                                        </Text>
                                    </Text>
                                    {order.total_price !== null && (
                                        <Text style={[shared.footerText, { color: colors.secondary }]}>
                                            Total: {formatRupiah(order.total_price)}
                                        </Text>
                                    )}
                                    {order.payment.paid !== null && (
                                        <Text style={[shared.footerText, { color: colors.secondary }]}>
                                            Bayar: {formatRupiah(order.payment.paid)}
                                        </Text>
                                    )}
                                    {order.payment.change !== null && (
                                        <Text style={[shared.footerText, { color: colors.secondary }]}>
                                            Kembalian: {formatRupiah(order.payment.change)}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Footer */}
                    <View style={shared.footer} fixed>
                        <Text style={shared.footerText}>Laporan Detail Transaksi — Sistem Laundry</Text>
                        <Text
                            style={shared.footerText}
                            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                        />
                    </View>
                </Page>
            ))}
        </Document>
    );
}
