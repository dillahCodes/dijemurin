import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'Apakah mendukung banyak cabang (multi-outlet)?',
        answer: 'Ya, sistem kami dirancang khusus untuk manajemen multi-outlet terpusat. Anda bisa memantau semua cabang dari satu akun Super Admin, mengelola harga per outlet, dan melihat performa real-time.',
    },
    {
        question: 'Bagaimana pelanggan melacak pesanan?',
        answer: 'Pelanggan dapat memasukkan kode pesanan unik (contoh: ORD-JD-2026...) di halaman publik tanpa perlu login. Status akan terupdate secara real-time dari operator.',
    },
    {
        question: 'Apakah ada laporan keuangan dan insiden pakaian?',
        answer: 'Tersedia laporan laba rugi, omzet kotor, beban kompensasi insiden pakaian (Accident Loss), dan omzet bersih yang dapat diunduh dalam format PDF secara instan.',
    },
    {
        question: 'Bagaimana pembagian peran (RBAC) di sistem ini?',
        answer: 'Sistem menyediakan hak akses khusus untuk Kasir (pos transaksi & cetak struk), Operator (antrean laundry & proses status), dan Admin (manajemen harga & klaim insiden).',
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="px-4 py-16 sm:px-6 md:py-24" id="faq">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                    <h2 className="font-sans text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-white">
                        Pertanyaan Umum
                    </h2>
                    <p className="font-sans text-base text-zinc-600 dark:text-zinc-400">
                        Hal yang sering ditanyakan oleh mitra dan pengusaha laundry.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <div
                                key={idx}
                                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900/60"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    className="flex w-full items-center justify-between p-6 text-left font-sans text-base font-bold text-zinc-950 transition-colors hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800/50"
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 text-zinc-950 dark:text-white' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="border-t border-zinc-100 p-6 font-sans text-sm leading-relaxed text-zinc-600 sm:text-base dark:border-zinc-800/80 dark:text-zinc-400">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
