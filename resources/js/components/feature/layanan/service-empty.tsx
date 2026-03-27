import { SearchX } from 'lucide-react';
import { Activity } from 'react';

interface ServiceEmptyProps {
    search: string;
}

export function ServiceEmpty({ search }: ServiceEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-7 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">Layanan tidak ditemukan</p>
                <Activity mode={search ? 'visible' : 'hidden'}>
                    <p className="text-xs text-muted-foreground">
                        Tidak ada layanan yang cocok dengan <span className="font-medium text-foreground">"{search}"</span>
                    </p>
                </Activity>

                <Activity mode={search ? 'hidden' : 'visible'}>
                    <p className="text-xs text-muted-foreground">Belum ada layanan yang tersedia saat ini.</p>
                </Activity>
            </div>
        </div>
    );
}
