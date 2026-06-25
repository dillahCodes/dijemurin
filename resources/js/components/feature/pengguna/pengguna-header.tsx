import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pengguna from '@/routes/pengguna';

export function PenggunaHeader() {
    const handleGoToAddForm = () => {
        router.get(pengguna.create().url);
    };

    return (
        <div className="flex justify-between gap-4 items-center">
            <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">Daftar Pengguna</h1>
                <p className="text-sm text-muted-foreground sm:text-base md:text-lg">
                    Kelola, filter, dan tambah data pengguna.
                </p>
            </div>

            <Button
                type="button"
                onClick={handleGoToAddForm}
                className="shrink-0 cursor-pointer"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Pengguna</span>
            </Button>
        </div>
    );
}
