import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LayananItemTambahHeader() {
    return (
        <CardHeader className="p-0">
            <CardTitle className="text-xl sm:text-2xl">Tambah Price List</CardTitle>
            <CardDescription className="text-sm sm:text-base">Isi form untuk menambah price list baru.</CardDescription>
        </CardHeader>
    );
}
