import { Store } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { useServiceOutletPicker } from '@/hooks/feature/layanan/use-service-outlet-picker';
import type { Outlet } from '@/types/feature/outlet/outlet';

export function ServiceOutletPicker() {
    const { data, handlers } = useServiceOutletPicker();

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
            {/* Icon + heading */}
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <Store size={28} className="text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Pilih Outlet</h2>
                    <p className="max-w-xs text-sm text-muted-foreground sm:text-base">
                        Pilih outlet terlebih dahulu sebelum melihat daftar layanan.
                    </p>
                </div>
            </div>

            {/* Outlet combobox + confirm */}
            <div className="flex w-full max-w-sm flex-col gap-3">
                <Combobox name="outlet_id" items={data.outlets} onInputValueChange={handlers.handleFetchOutlets}>
                    <ComboboxInput placeholder="Ketik nama outlet (min. 3 huruf)..." />
                    <ComboboxContent>
                        <Activity mode={!data.outlets?.length ? 'visible' : 'hidden'}>
                            <ComboboxEmpty>Outlet tidak ditemukan.</ComboboxEmpty>
                        </Activity>
                        <ComboboxList>
                            {data.outlets?.map((outlet: Outlet) => (
                                <ComboboxItem
                                    key={outlet.id}
                                    value={outlet.name}
                                    onClick={() => handlers.handleSelectOutlet(outlet)}
                                >
                                    {outlet.name}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>

                <Button onClick={handlers.handleConfirm} disabled={!data.selectedOutlet} className="w-full cursor-pointer">
                    Lihat Layanan
                </Button>
            </div>
        </div>
    );
}
