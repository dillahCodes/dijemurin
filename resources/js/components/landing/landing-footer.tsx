import { Globe } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="border-t border-zinc-200/80 bg-white px-4 py-12 sm:px-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-12 border-b border-zinc-200/80 pb-12 md:grid-cols-4 lg:gap-16 dark:border-zinc-800">
                    <div className="space-y-6 md:col-span-2">
                        <a href="#" className="font-sans text-2xl font-black tracking-tighter text-zinc-950 dark:text-white">
                            DIJEMURIN.ID
                        </a>
                        <p className="max-w-sm font-sans text-sm text-zinc-600 dark:text-zinc-400">
                            Solusi ERP laundry modern yang fokus pada transparansi operasional dan pertumbuhan bisnis
                            berkelanjutan. Didukung teknologi cloud terintegrasi.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-sans text-xs font-bold tracking-wider text-zinc-950 uppercase dark:text-white">
                            Produk
                        </h4>
                        <ul className="space-y-2.5 font-sans text-sm text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="#fitur" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Sistem Kasir
                                </a>
                            </li>
                            <li>
                                <a href="#fitur" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Manajemen Antrean
                                </a>
                            </li>
                            <li>
                                <a href="#fitur" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Laporan Keuangan
                                </a>
                            </li>
                            <li>
                                <a href="#lacak" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Lacak Pesanan
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-sans text-xs font-bold tracking-wider text-zinc-950 uppercase dark:text-white">
                            Perusahaan
                        </h4>
                        <ul className="space-y-2.5 font-sans text-sm text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="#faq" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Kontak
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
                                    Kebijakan Privasi
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
                    <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400">
                        © {new Date().getFullYear()} Dijemurin.id. Enterprise Laundry Solutions.
                    </p>
                    <div className="flex items-center gap-2 font-sans text-xs text-zinc-500 dark:text-zinc-400">
                        <Globe className="h-4 w-4" />
                        <span>Indonesia (ID)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
