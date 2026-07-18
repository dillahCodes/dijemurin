import { usePage } from '@inertiajs/react';
import { CalendarSearchIcon } from 'lucide-react';
import { Activity } from 'react';
import type { Report, ReportFilters } from '@/types/feature/laporan';
import type { ApiResponse } from '@/types/response';
import { LaporanCard } from './laporan-card';
import { LaporanHeader } from './laporan-header';
import { FirstLevelPdf } from './pdf/first-level-pdf';
import { MiddleLevelPdf } from './pdf/middle-level-pdf';
import { TopLevelPdf } from './pdf/top-level-pdf';

export type LaporanPageProps = {
    reports: ApiResponse<Report>;
    filters: ReportFilters;
};

export function LaporanSection() {
    const { reports } = usePage<LaporanPageProps>().props;
    const reportsData = reports.data;

    const period = reportsData.period;
    const top_level = reportsData.top_level;
    const middle_level = reportsData.middle_level;
    const first_level = reportsData.first_level;

    const hasDateRange = period.start_date !== null && period.end_date !== null;
    const periodLabel = hasDateRange ? `${period.start_date}_${period.end_date}` : 'semua';

    return (
        <div className="flex flex-col gap-6">
            <LaporanHeader />

            <Activity mode={hasDateRange ? 'visible' : 'hidden'}>
                <div className="grid gap-6">
                    <Activity mode={top_level ? 'visible' : 'hidden'}>
                        <LaporanCard
                            title="Laporan Ringkasan"
                            description="Ringkasan eksekutif: total pesanan, pendapatan, rekap pembayaran, dan top 5 layanan terlaris dalam periode yang dipilih."
                            filename={`laporan-ringkasan_${periodLabel}.pdf`}
                            document={<TopLevelPdf period={period} data={top_level} />}
                        />
                    </Activity>
                    <Activity mode={middle_level ? 'visible' : 'hidden'}>
                        <LaporanCard
                            title="Laporan Analitik"
                            description="Analitik mendalam: rekap harian, distribusi status pesanan, rekap pembayaran, dan performa setiap layanan per periode."
                            filename={`laporan-analitik_${periodLabel}.pdf`}
                            document={<MiddleLevelPdf period={period} data={middle_level} />}
                        />
                    </Activity>
                    <LaporanCard
                        title="Laporan Detail Transaksi"
                        description="Rincian lengkap setiap transaksi harian: item layanan, jumlah, subtotal, metode pembayaran, dan kembalian."
                        filename={`laporan-detail-transaksi_${periodLabel}.pdf`}
                        document={<FirstLevelPdf period={period} data={first_level} />}
                    />
                </div>
            </Activity>

            <Activity mode={!hasDateRange ? 'visible' : 'hidden'}>
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-14 text-center text-muted-foreground">
                    <CalendarSearchIcon className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">Pilih rentang tanggal terlebih dahulu</p>
                    <p className="text-xs opacity-70">
                        Isi Tanggal Mulai dan Tanggal Akhir, lalu klik Terapkan untuk memuat laporan.
                    </p>
                </div>
            </Activity>
        </div>
    );
}
