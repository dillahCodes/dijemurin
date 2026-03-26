interface ServiceItemsEmptyProps {
    serviceName: string;
}

export function ServiceItemsEmpty({ serviceName }: ServiceItemsEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-bold text-muted-foreground">
                    {serviceName.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                    Belum ada item
                </p>
                <p className="text-xs text-muted-foreground">
                    Layanan{' '}
                    <span className="font-medium text-foreground">
                        {serviceName}
                    </span>{' '}
                    belum memiliki item tersedia.
                </p>
            </div>
        </div>
    );
}
