import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ReportMiddleLevel, ReportPeriod } from '@/types/feature/laporan';
import { shared, formatRupiah, formatDate } from './pdf-styles';

interface Props {
    period: ReportPeriod;
    data: ReportMiddleLevel;
}

export function MiddleLevelPdf({ period, data }: Props) {
    const { daily_summary, status_summary, payment_summary, service_summary } = data;

    return (
        <Document title="Laporan Analitik" author="Sistem Laundry">
            <Page size="A4" style={shared.page}>
                {/* Header */}
                <View style={shared.headerRow}>
                    <View>
                        <Text style={shared.headerTitle}>Laporan Analitik</Text>
                        <Text style={shared.headerSubtitle}>Rekap harian, status, pembayaran, dan layanan</Text>
                    </View>
                    <View style={shared.periodBadge}>
                        <Text style={shared.periodLabel}>Periode</Text>
                        <Text style={shared.periodValue}>
                            {formatDate(period.start_date)} – {formatDate(period.end_date)}
                        </Text>
                    </View>
                </View>

                {/* Daily Summary */}
                <View style={shared.section}>
                    <Text style={shared.sectionTitle}>Rekap Harian</Text>
                    <View style={shared.table}>
                        <View style={shared.tableHeader}>
                            <Text style={[shared.thText, { flex: 2 }]}>Tanggal</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Pesanan</Text>
                            <Text style={[shared.thText, { flex: 2, textAlign: 'right' }]}>Pendapatan</Text>
                        </View>
                        {daily_summary.map((row, i) => (
                            <View key={row.date} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                <Text style={[shared.tdText, { flex: 2 }]}>{formatDate(row.date)}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{row.total_order}</Text>
                                <Text style={[shared.tdText, { flex: 2, textAlign: 'right' }]}>
                                    {formatRupiah(row.total_revenue)}
                                </Text>
                            </View>
                        ))}
                        <View style={shared.tableRow}>
                            <Text style={[shared.tdText, { flex: 2, fontWeight: 'bold' }]}>Total</Text>
                            <Text style={[shared.tdText, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                                {daily_summary.reduce((acc, row) => acc + row.total_order, 0)}
                            </Text>
                            <Text style={[shared.tdText, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>
                                {formatRupiah(daily_summary.reduce((acc, row) => acc + row.total_revenue, 0))}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status & Payment side by side */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={shared.sectionTitle}>Status Pesanan</Text>
                        <View style={shared.table}>
                            <View style={shared.tableHeader}>
                                <Text style={[shared.thText, { flex: 2 }]}>Status</Text>
                                <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Jumlah</Text>
                            </View>
                            {Object.entries(status_summary).map(([label, count], i) => (
                                <View key={label} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                    <Text style={[shared.tdText, { flex: 2 }]}>{label}</Text>
                                    <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{count}</Text>
                                </View>
                            ))}
                            <View style={shared.tableRow}>
                                <Text style={[shared.tdText, { flex: 2, fontWeight: 'bold' }]}>Total</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                                    {Object.values(status_summary).reduce((acc, count) => acc + count, 0)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={shared.sectionTitle}>Pembayaran</Text>
                        <View style={shared.table}>
                            <View style={shared.tableHeader}>
                                <Text style={[shared.thText, { flex: 2 }]}>Metode</Text>
                                <Text style={[shared.thText, { flex: 2, textAlign: 'right' }]}>Total</Text>
                            </View>
                            {Object.entries(payment_summary).map(([method, amount], i) => (
                                <View key={method} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                    <Text style={[shared.tdText, { flex: 2, textTransform: 'capitalize' }]}>{method}</Text>
                                    <Text style={[shared.tdText, { flex: 2, textAlign: 'right' }]}>
                                        {formatRupiah(amount)}
                                    </Text>
                                </View>
                            ))}
                            <View style={shared.tableRow}>
                                <Text style={[shared.tdText, { flex: 2, fontWeight: 'bold' }]}>Total</Text>
                                <Text style={[shared.tdText, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>
                                    {formatRupiah(daily_summary.reduce((acc, row) => acc + row.total_revenue, 0))}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Service Summary */}
                <View style={shared.section}>
                    <Text style={shared.sectionTitle}>Rekap Layanan</Text>
                    <View style={shared.table}>
                        <View style={shared.tableHeader}>
                            <Text style={[shared.thText, { flex: 3 }]}>Layanan</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Qty</Text>
                            <Text style={[shared.thText, { flex: 1, textAlign: 'right' }]}>Satuan</Text>
                            <Text style={[shared.thText, { flex: 2, textAlign: 'right' }]}>Pendapatan</Text>
                        </View>
                        {service_summary.map((svc, i) => (
                            <View key={svc.item_name} style={[shared.tableRow, i % 2 !== 0 ? shared.tableRowAlt : {}]}>
                                <Text style={[shared.tdText, { flex: 3 }]}>{svc.item_name}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{svc.total_qty}</Text>
                                <Text style={[shared.tdText, { flex: 1, textAlign: 'right' }]}>{svc.unit}</Text>
                                <Text style={[shared.tdText, { flex: 2, textAlign: 'right' }]}>
                                    {formatRupiah(svc.total_revenue)}
                                </Text>
                            </View>
                        ))}
                        <View style={shared.tableRow}>
                            <Text style={[shared.tdText, { flex: 3, fontWeight: 'bold' }]}>Total</Text>
                            <Text style={[shared.tdText, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]} />
                            <Text style={[shared.tdText, { flex: 1 }]} />
                            <Text style={[shared.tdText, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>
                                {formatRupiah(service_summary.reduce((acc, svc) => acc + svc.total_revenue, 0))}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={shared.footer} fixed>
                    <Text style={shared.footerText}>Laporan Analitik — Sistem Laundry</Text>
                    <Text
                        style={shared.footerText}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    />
                </View>
            </Page>
        </Document>
    );
}
