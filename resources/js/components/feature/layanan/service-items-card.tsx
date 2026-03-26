import { router } from '@inertiajs/react';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/helper/formatted-price';

interface ServiceItemCardProps {
    serviceId: number;
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    time: string;
}

/** 1. Internal Hook (Logic) */
function useServiceItem({ id, serviceId, name, price }: Partial<ServiceItemCardProps>) {
    const modal = useModal();
    const formattedPrice = formatPrice(price as number);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: implement edit
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        modal.open({
            title: `Hapus Price List`,
            content: `Apakah anda yakin ingin menghapus Price List ${name}?`,
            onConfirm: () =>
                new Promise((resolve) => {
                    router.delete(`/layanan/${serviceId}/item/${id}`, {
                        preserveScroll: true,
                        onSuccess: () =>
                            toast.success('Price List berhasil dihapus', {
                                position: 'top-center',
                            }),
                        onError: () =>
                            toast.error('Price List gagal dihapus', {
                                position: 'top-center',
                            }),
                        onFinish: () => resolve(undefined),
                    });
                }),
        });
    };

    return { formattedPrice, handleEdit, handleDelete };
}

interface ServiceItemHeaderProps {
    name: string;
    description: string;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

/** 2. Sub-components (UI Units) */
function ServiceItemHeader({ name, description, onEdit, onDelete }: ServiceItemHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <CardHeader className="p-0!">
                <CardTitle className="line-clamp-1 text-base">{name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="z-10 shrink-0 cursor-pointer">
                        <EllipsisVertical size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                        <Pencil size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <Trash2 size={14} className="text-destructive" /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function ServiceItemFooter({ formattedPrice, unit, time }: any) {
    return (
        <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold tracking-tight text-foreground">{formattedPrice}</span>
                <span className="text-xs text-muted-foreground">per {unit}</span>
            </div>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{time}</span>
        </div>
    );
}

/** 3. Main Component */
export function ServiceItemCard(props: ServiceItemCardProps) {
    const { handleEdit, handleDelete, formattedPrice } = useServiceItem(props);

    return (
        <Card
            className={cn(
                'group relative w-full border-sidebar-border/70 p-0! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
            )}
        >
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            <CardContent className="relative z-10 flex h-full flex-col justify-between gap-4 p-6">
                <ServiceItemHeader {...props} onEdit={handleEdit} onDelete={handleDelete} />
                <ServiceItemFooter formattedPrice={formattedPrice} unit={props.unit} time={props.time} />
            </CardContent>
            <div className="absolute bottom-0 left-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
        </Card>
    );
}
