const FIRST_PAGE = 1;
const INCLUSIVE_OFFSET = 1;

// Konfigurasi jumlah tetangga (siblings) di kiri dan kanan
const SIBLING_COUNT_DESKTOP = 3; // 3 kiri + 1 aktif + 3 kanan = 7 items
const SIBLING_COUNT_MOBILE = 2; // 2 kiri + 1 aktif + 2 kanan = 5 items

/**
 * Helper untuk menghasilkan array angka berurutan
 */
const range = (start: number, end: number): number[] => {
    const length = Math.max(end - start + INCLUSIVE_OFFSET, 0);

    return Array.from({ length }, (_, idx) => idx + start);
};

export interface PaginationProps {
    currentPage: number | string;
    totalData: number;
    perPage: number;
    mode?: 'desktop' | 'mobile';
}

/**
 * Generator pagination tipe Sliding Window (Tanpa Titik-titik)
 */
export const getPaginationPages = ({ currentPage, totalData, perPage, mode = 'desktop' }: PaginationProps): number[] => {
    const page = parseInt(String(currentPage), 10);

    if (Number.isNaN(page) || page < FIRST_PAGE || totalData <= 0 || perPage <= 0) {
        return [];
    }

    const totalPages = Math.ceil(totalData / perPage);

    if (totalPages === FIRST_PAGE) {
return [FIRST_PAGE];
}

    // 1. Tentukan jumlah tetangga
    const siblingCount = mode === 'desktop' ? SIBLING_COUNT_DESKTOP : SIBLING_COUNT_MOBILE;

    // Total maksimal item yang bisa tampil di layar
    const maxPagesToShow = siblingCount * 2 + 1;

    // 2. Jika total halaman kurang dari batas maksimal, tampilkan semuanya
    if (totalPages <= maxPagesToShow) {
        return range(FIRST_PAGE, totalPages);
    }

    // 3. Kalkulasi batas awal dan akhir (sliding window)
    let startPage = page - siblingCount;
    let endPage = page + siblingCount;

    // 4. Koreksi Jendela (Clamp & Shift)
    // Jika mentok di kiri (misal aktif di halaman 2), geser sisa jatah jendelanya ke kanan
    if (startPage < FIRST_PAGE) {
        const overflowLeft = FIRST_PAGE - startPage;
        startPage = FIRST_PAGE;
        endPage += overflowLeft;
    }

    // Jika mentok di kanan (misal aktif di halaman terakhir), geser sisa jatah jendelanya ke kiri
    if (endPage > totalPages) {
        const overflowRight = endPage - totalPages;
        endPage = totalPages;
        startPage -= overflowRight;

        // Safety check untuk memastikan startPage tidak pernah di bawah 1
        startPage = Math.max(startPage, FIRST_PAGE);
    }

    return range(startPage, endPage);
};
