import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { laporan } from '@/routes';
import type { LaporanPageProps } from './laporan-section';

export function LaporanHeader() {
    const { filters } = usePage<LaporanPageProps>().props;

    const [date, setDate] = useState({
        start_date: filters.start_date ?? '',
        end_date: filters.end_date ?? '',
    });

    const isDisabled = date.start_date === filters.start_date && date.end_date === filters.end_date;
    const hasDateRange = date.start_date !== '' && date.end_date !== '';

    function handleApply() {
        router.get(laporan.url(), { start_date: date.start_date, end_date: date.end_date }, { preserveState: false });
    }

    const handleReset = () => {
        router.get(laporan.url(), { preserveState: false });
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Laporan &amp; Analitik</h1>
                <p className="text-muted-foreground">
                    Unduh laporan dan rincian data transaksi berdasarkan rentang tanggal yang dipilih.
                </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
                <div className="grid w-full gap-1.5 sm:w-fit">
                    <Label htmlFor="start-date">
                        Tanggal Mulai <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="date"
                        id="start-date"
                        className="flex items-center justify-center"
                        value={date.start_date}
                        onChange={(e) => setDate((prev) => ({ ...prev, start_date: e.target.value }))}
                    />
                </div>
                <div className="grid w-full gap-1.5 sm:w-fit">
                    <Label htmlFor="end-date">
                        Tanggal Akhir <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="date"
                        id="end-date"
                        className="flex items-center justify-center"
                        value={date.end_date}
                        onChange={(e) => setDate((prev) => ({ ...prev, end_date: e.target.value }))}
                    />
                </div>
                <Button
                    variant="outline"
                    className="w-full sm:w-fit"
                    disabled={isDisabled || !hasDateRange}
                    onClick={handleApply}
                >
                    Terapkan
                </Button>

                <Button variant="outline" className="w-full sm:w-fit" disabled={!hasDateRange} onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
}
