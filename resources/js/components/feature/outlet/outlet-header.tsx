import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import outletRoute from '@/routes/outlet';

export function OutletHeader() {
    const handleGoToAdd = () => {
        router.get(outletRoute.create().url);
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">Daftar Outlet</h1>
                <p className="text-left text-sm text-muted-foreground sm:text-base md:text-lg">
                    Kelola, filter, dan tambah data Outlet.
                </p>
            </div>

            <Button type="button" onClick={handleGoToAdd} className="shrink-0 cursor-pointer">
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Outlet</span>
            </Button>
        </div>
    );
}
