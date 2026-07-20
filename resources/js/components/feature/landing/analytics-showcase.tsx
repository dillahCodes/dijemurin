import { FileText, TrendingUp } from 'lucide-react';
import { useFadeLeft, useZoomIn } from '@/hooks/animations';

function AnalyticsMetricsPreview() {
    const ref = useZoomIn<HTMLDivElement>({ delay: 300, duration: 900 });

    return (
        <div ref={ref} className="relative">
            <div className="absolute inset-0 rotate-2 rounded-[32px] bg-zinc-950/5 dark:bg-white/5" />
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-200/80 bg-zinc-50 p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="rounded-[24px] border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-900">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-rose-500" />
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                        <span className="font-sans text-xs font-semibold text-zinc-400">Dijemurin.id Executive Report</span>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                                <span className="text-[11px] font-medium text-zinc-400">Total Omzet</span>
                                <p className="font-sans text-base font-bold text-zinc-900 dark:text-white">Rp 48.500.000</p>
                                <span className="text-[10px] font-semibold text-emerald-600">+14.2%</span>
                            </div>
                            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                                <span className="text-[11px] font-medium text-zinc-400">Beban Insiden</span>
                                <p className="font-sans text-base font-bold text-rose-600 dark:text-rose-400">Rp 450.000</p>
                                <span className="text-[10px] font-semibold text-rose-500">-2.1% loss</span>
                            </div>
                            <div className="col-span-2 rounded-xl bg-zinc-950 p-3 text-white sm:col-span-1 dark:bg-zinc-800">
                                <span className="text-[11px] font-medium text-zinc-400">Laba Bersih</span>
                                <p className="font-sans text-base font-bold text-emerald-400">Rp 48.050.000</p>
                                <span className="text-[10px] font-semibold text-zinc-300">Verified</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-900 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-sans text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                    Grafik Pendapatan Branch
                                </span>
                                <span className="font-sans text-[11px] text-zinc-400">Juli 2026</span>
                            </div>
                            <div className="flex h-24 items-end justify-between gap-2 pt-2">
                                <div className="h-[45%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-[65%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-[30%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-[90%] w-full rounded-t-xs bg-zinc-950 dark:bg-white" />
                                <div className="h-[75%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-[50%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-[85%] w-full rounded-t-xs bg-zinc-300 dark:bg-zinc-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AnalyticsShowcase() {
    const textContentRef = useFadeLeft<HTMLDivElement>({ delay: 100 });

    return (
        <section className="px-4 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div ref={textContentRef} className="space-y-8">
                        <span className="inline-block rounded-full bg-zinc-100 px-4 py-1 font-sans text-xs font-bold tracking-widest text-zinc-900 uppercase dark:bg-zinc-800 dark:text-zinc-100">
                            ANALYTICS
                        </span>

                        <h2 className="font-sans text-3xl leading-tight font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-white">
                            Analisis Keuangan & Laporan PDF Eksekutif
                        </h2>

                        <p className="font-sans text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
                            Dapatkan visibilitas penuh terhadap kesehatan bisnis Anda. Pantau omzet, laba rugi, dan kerugian
                            insiden secara real-time. Unduh laporan formal untuk kebutuhan manajerial.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200/50 bg-zinc-100/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
                                <div className="rounded-xl bg-white p-3 shadow-xs dark:bg-zinc-800">
                                    <FileText className="h-6 w-6 text-zinc-950 dark:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-base font-bold text-zinc-950 dark:text-white">
                                        Export PDF Formal
                                    </h4>
                                    <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                                        Siap cetak untuk laporan harian, mingguan, atau bulanan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200/50 bg-zinc-100/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
                                <div className="rounded-xl bg-white p-3 shadow-xs dark:bg-zinc-800">
                                    <TrendingUp className="h-6 w-6 text-zinc-950 dark:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-sans text-base font-bold text-zinc-950 dark:text-white">
                                        Net Profit Tracking
                                    </h4>
                                    <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                                        Perhitungan laba bersih setelah dikurangi biaya operasional & kompensasi insiden.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnalyticsMetricsPreview />
                </div>
            </div>
        </section>
    );
}
