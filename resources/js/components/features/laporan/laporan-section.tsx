import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DownloadIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

// 1. Local Types
interface LaporanCardProps {
    title: string;
    description: string;
    onDownload?: () => void;
}

// 2. Sub-components
function LaporanHeader() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                    Laporan & Analitik
                </h1>
                <p className="text-muted-foreground">
                    Unduh laporan dan rincian data transaksi berdasarkan rentang
                    tanggal yang dipilih.
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
                    />
                </div>
                <Button variant="default" className="w-full sm:w-fit">
                    Terapkan
                </Button>
            </div>
        </div>
    );
}

function LaporanCard({ title, description, onDownload }: LaporanCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={onDownload} className="w-full gap-2 sm:w-auto">
                    <DownloadIcon className="h-4 w-4" />
                    Download
                </Button>
            </CardFooter>
        </Card>
    );
}

// 3. Main Component
export function LaporanSection() {
    return (
        <div className="flex flex-col gap-6">
            <LaporanHeader />
            <div className="grid gap-6">
                <LaporanCard
                    title="Detail Laporan"
                    description="Unduh data komprehensif secara mendalam terkait rincian transaksi harian, status pesanan, dan berbagai metrik performa."
                />
                <LaporanCard
                    title="Laporan"
                    description="Unduh rangkuman eksekutif bulanan atau laporan agregasi pemasukan untuk keperluan manajemen dan evaluasi bisnis."
                />
            </div>
        </div>
    );
}
