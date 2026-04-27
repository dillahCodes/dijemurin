import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LayananItemEditHeader() {
    return (
        <CardHeader className="p-0">
            <CardTitle className="text-xl sm:text-2xl">Edit Price List</CardTitle>
            <CardDescription className="text-sm sm:text-base">Isi form untuk memperbarui price list.</CardDescription>
        </CardHeader>
    );
}
