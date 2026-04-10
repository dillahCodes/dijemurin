import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ReportTopLevel, ReportPeriod } from '@/types/feature/laporan';
import { shared, colors, formatRupiah, formatDate } from './pdf-styles';

interface Props {
    period: ReportPeriod;
    data: ReportTopLevel;
}

export function TopLevelPdf({ period, data }: Props) {
    const { summary, total_revenue, payment_summary, top_services } = data;

    return (
        <Document title="Laporan Ringkasan" author="Sistem Laundry">
            <Page size="A4" style={shared.page}>
                {/* Header */}
                <View style={shared.headerRow}>
                    <View>
                        <Text style={shared.headerTitle}>Laporan Ringkasan</Text>
                        <Text style={shared.headerSubtitle}>Ringkasan eksekutif performa bisnis</Text>
                    </View>
                    <View style={shared.periodBadge}>
                        <Text style={shared.periodLabel}>Periode</Text>
                        <Text style={shared.periodValue}>
                            {formatDate(period.start_date)} – {formatDate(period.end_date)}
                        </Text>
                    </View>
                </View>

                {/* Stat Cards */}
                <View style={shared.statRow}>
                    <View style={shared.statCard}>
                        <Text style={shared.statLabel}>Total Pesanan</Text>
                        <Text style={shared.statValue}>{summary.total_order}</Text>
                    </View>
                    <View style={shared.statCard}>
                        <Text style={shared.statLabel}>Selesai</Text>
                        <Text style={[shared.statValue, { color: colors.success }]}>{summary.completed}</Text>
                    </View>
                    <View style={shared.statCard}>
                        <Text style={shared.statLabel}>Dibatalkan</Text>
                        <Text style={[shared.statValue, { color: colors.danger }]}>{summary.cancelled}</Text>
                    </View>
                    <View style={shared.statCard}>
                        <Text style={shared.statLabel}>Total Pendapatan</Text>
                        <Text style={[shared.statValue, { fontSize: 11 }]}>{formatRupiah(total_revenue)}</Text>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={shared.section}>
                    <Text style={shared.sectionTitle}>Ringkasan Pembayaran</Text>
                    <View style={shared.table}>
                        <View style={shared.tableHeader}>
                            <Text style={[shared.thText, { flex: 1 }]}>Metode</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Jumlah</Text>
                        </View>
                        {Object.entries(payment_summary).map(([method, amount], i) => (
                            <View key={method} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                <Text style={[shared.tdText, { flex: 1, textTransform: 'capitalize' }]}>{method}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{formatRupiah(amount)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Top Services */}
                <View style={shared.section}>
                    <Text style={shared.sectionTitle}>Top 5 Layanan</Text>
                    <View style={shared.table}>
                        <View style={shared.tableHeader}>
                            <Text style={[shared.thText, { flex: 3 }]}>Layanan</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Qty</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Satuan</Text>
                        </View>
                        {top_services.map((svc, i) => (
                            <View key={svc.item_name} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                <Text style={[shared.tdText, { flex: 3 }]}>{svc.item_name}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{svc.total_qty}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{svc.unit}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={shared.footer} fixed>
                    <Text style={shared.footerText}>Laporan Ringkasan — Sistem Laundry</Text>
                    <Text
                        style={shared.footerText}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    />
                </View>
            </Page>
        </Document>
    );
}
