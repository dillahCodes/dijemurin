interface AccidentEditHeaderProps {
    id: number;
}

export function AccidentEditHeader({ id }: AccidentEditHeaderProps) {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">
                Ubah Laporan Insiden #{id}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
                Perbaiki kesalahan ketik, kronologi, atau jenis kerusakan pada laporan insiden.
            </p>
        </div>
    );
}
