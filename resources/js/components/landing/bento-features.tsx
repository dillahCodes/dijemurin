import { AlertTriangle, GitFork, ShieldCheck, ShoppingCart, Store, Workflow } from 'lucide-react';

export function BentoFeatures() {
    return (
        <section className="px-4 py-16 sm:px-6 md:py-24" id="fitur">
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="space-y-4 text-center">
                    <span className="inline-block rounded-full bg-zinc-100 px-4 py-1 font-sans text-xs font-bold tracking-widest text-zinc-900 uppercase dark:bg-zinc-800 dark:text-zinc-100">
                        SOLUSI ENTERPRISE
                    </span>
                    <h2 className="font-sans text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-white">
                        Kelola Bisnis Tanpa Batas
                    </h2>
                </div>

                {/* Enhanced Bento Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                    {/* Multi-Outlet Management */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-8 text-white md:col-span-3 md:p-10 dark:bg-zinc-900">
                        <div className="relative z-10 space-y-4">
                            <Store className="h-10 w-10 text-white" />
                            <h3 className="font-sans text-2xl font-bold md:text-3xl">Multi-Outlet Management</h3>
                            <p className="max-w-sm font-sans text-sm text-zinc-400 sm:text-base">
                                Kelola semua cabang Anda secara terpusat. Monitor performa setiap outlet secara real-time
                                dari satu dashboard utama.
                            </p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 z-0 opacity-10 transition-transform duration-700 group-hover:scale-110">
                            <GitFork className="h-64 w-64 text-white" />
                        </div>
                    </div>

                    {/* Role-Based Access Control */}
                    <div className="flex flex-col justify-between rounded-[32px] border border-zinc-200/80 bg-zinc-50/50 p-8 md:col-span-3 md:p-10 dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="space-y-4">
                            <ShieldCheck className="h-10 w-10 text-zinc-950 dark:text-white" />
                            <h3 className="font-sans text-2xl font-bold text-zinc-950 md:text-3xl dark:text-white">
                                Role-Based Access Control
                            </h3>
                            <p className="max-w-sm font-sans text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
                                Panel khusus untuk Kasir, Operator, dan Admin. Keamanan data terjaga dengan pembatasan hak
                                akses yang ketat.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-2">
                            <span className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 font-sans text-xs font-bold tracking-wider text-zinc-800 uppercase shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                Kasir
                            </span>
                            <span className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 font-sans text-xs font-bold tracking-wider text-zinc-800 uppercase shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                Operator
                            </span>
                            <span className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 font-sans text-xs font-bold tracking-wider text-zinc-800 uppercase shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                Admin
                            </span>
                        </div>
                    </div>

                    {/* Interactive Cart */}
                    <div className="flex flex-col justify-between rounded-[32px] border border-zinc-200/80 bg-white p-8 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <ShoppingCart className="h-9 w-9 text-zinc-950 dark:text-white" />
                        <div className="mt-8 space-y-2">
                            <h4 className="font-sans text-xl font-bold text-zinc-950 dark:text-white">
                                Keranjang Interaktif
                            </h4>
                            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                                Perhitungan harga otomatis & estimasi waktu selesai secara instan saat transaksi.
                            </p>
                        </div>
                    </div>

                    {/* Sequential Tracking */}
                    <div className="flex flex-col justify-between rounded-[32px] border border-zinc-200/80 bg-white p-8 shadow-xs md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <Workflow className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                        <div className="mt-8 space-y-2">
                            <h4 className="font-sans text-xl font-bold text-zinc-950 dark:text-white">
                                Sequential Tracking
                            </h4>
                            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                                Alur kerja sistematis dari Pending, Proses, Selesai, hingga Diambil oleh pelanggan.
                            </p>
                        </div>
                    </div>

                    {/* Accident Logging */}
                    <div className="flex flex-col justify-between rounded-[32px] border border-zinc-200/80 bg-white p-8 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <AlertTriangle className="h-9 w-9 text-rose-600 dark:text-rose-400" />
                        <div className="mt-8 space-y-2">
                            <h4 className="font-sans text-xl font-bold text-zinc-950 dark:text-white">
                                Accident & Audit Log
                            </h4>
                            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                                Penanganan profesional untuk pakaian rusak atau hilang dengan bukti audit transparan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
