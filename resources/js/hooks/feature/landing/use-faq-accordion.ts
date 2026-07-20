import { FAQItem } from '@/types/feature/landing';
import { useState } from 'react';

export const defaultFaqs: FAQItem[] = [
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

export function useFaqAccordion(initialIndex = 0) {
    const [openIndex, setOpenIndex] = useState<number | null>(initialIndex);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return {
        faqs: defaultFaqs,
        openIndex,
        toggle,
    };
}
