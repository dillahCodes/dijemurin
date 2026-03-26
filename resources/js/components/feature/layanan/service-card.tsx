import { router } from '@inertiajs/react';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
    id: number;
    title: string;
    description: string;
}

/** 1. Internal Hook (Logic) */
function useServiceActions({ id, title }: Partial<ServiceCardProps>) {
    const modal = useModal();
    const handleNavigate = () => router.visit(`/layanan/${id}`);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: implement edit
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        modal.open({
            title: `Hapus Layanan`,
            content: `Apakah anda yakin ingin menghapus layanan ${title}?`,
            onConfirm: () =>
                new Promise((resolve) => {
                    router.delete(`/layanan/${id}`, {
                        preserveScroll: true,
                        onSuccess: () =>
                            toast.success('Layanan berhasil dihapus', {
                                position: 'top-center',
                            }),
                        onError: () =>
                            toast.error('Layanan gagal dihapus', {
                                position: 'top-center',
                            }),
                        onFinish: () => resolve(undefined),
                    });
                }),
        });
    };

    return { handleNavigate, handleEdit, handleDelete };
}

interface ServiceHeaderContentProps {
    title: string;
    description: string;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

/** 2. Sub-components (UI Units) */
function ServiceHeaderContent({ title, description, onEdit, onDelete }: ServiceHeaderContentProps) {
    return (
        <div className="flex w-full items-center justify-between">
            <CardHeader className="p-0!">
                <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
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

/** 3. Main Component */
export function ServiceCard(props: ServiceCardProps) {
    const { handleNavigate, handleEdit, handleDelete } = useServiceActions(props);

    return (
        <Card
            onClick={handleNavigate}
            className={cn(
                'group relative flex w-full cursor-pointer flex-row! justify-between overflow-hidden border-sidebar-border/70 p-4! py-6! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
            )}
        >
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            <div className="absolute bottom-0 left-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
            <ServiceHeaderContent {...props} onEdit={handleEdit} onDelete={handleDelete} />
        </Card>
    );
}
