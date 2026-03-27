import { router } from '@inertiajs/react';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { Activity } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDrawer } from '@/components/ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useModal } from '@/components/ui/modal';
import { formatPrice } from '@/helper/formatted-price';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import layanan from '@/routes/layanan';

interface ServiceItemCardProps {
    serviceId: number;
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    time: string;
}

interface GetMenus {
    handleEdit: (e: React.MouseEvent) => void;
    handleDelete: (e: React.MouseEvent) => void;
}

const getMenus = ({ handleEdit, handleDelete }: GetMenus) => [
    {
        label: 'Edit',
        icon: Pencil,
        onClick: handleEdit,
    },
    {
        label: 'Hapus',
        icon: Trash2,
        onClick: handleDelete,
        className: 'text-destructive focus:text-destructive',
        iconClassName: 'text-destructive',
    },
];

/** 1. Internal Hook (Logic) */
function useServiceItem({ id, serviceId, name, price }: ServiceItemCardProps) {
    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const modal = useModal();
    const formattedPrice = formatPrice(price);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: implement edit
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        modal.open({
            id: 'modal-confirm-delete-service-item',
            title: `Hapus Price List`,
            content: <div className="line-clamp-2">Apakah anda yakin ingin menghapus Price List {name}?</div>,
            onConfirm: () =>
                new Promise((resolve) => {
                    router.delete(layanan.items.destroy({ service: serviceId, serviceItem: id }).url, {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Price List berhasil dihapus', {
                                position: 'top-center',
                            });

                            if (isMobile) {
drawer.close('service-item-drawer');
}
                        },
                        onError: () => {
                            toast.error('Price List gagal dihapus', {
                                position: 'top-center',
                            });

                            if (isMobile) {
drawer.close('service-item-drawer');
}
                        },
                        onFinish: () => resolve(undefined),
                    });
                }),
            cancelContent: 'Batal',
            confirmContent: 'Hapus',
        });
    };

    return { formattedPrice, handleEdit, handleDelete };
}

interface DrawerMenu {
    menu: ReturnType<typeof getMenus>;
}

function DrawerContent({ menu }: DrawerMenu) {
    return (
        <Card className="border-none shadow-md">
            <div className="flex flex-col gap-4">
                {menu.map((menu) => (
                    <Button variant={'ghost'} key={menu.label} onClick={menu.onClick} className={menu.className}>
                        <menu.icon size={14} className={menu.iconClassName} /> {menu.label}
                    </Button>
                ))}
            </div>
        </Card>
    );
}

interface ServiceItemHeaderProps {
    name: string;
    description: string;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

/** 2. Sub-components (UI Units) */
function ServiceItemHeader({ name, description, onEdit, onDelete }: ServiceItemHeaderProps) {
    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const menus = getMenus({ handleEdit: onEdit, handleDelete: onDelete });

    const handleOpenDrawer = (e: React.MouseEvent) => {
        e.stopPropagation();
        drawer.open({
            id: 'service-item-drawer',
            wrapperClassName: 'rounded-t-xl p-3',
            content: <DrawerContent menu={menus} />,
        });
    };

    return (
        <div className="flex items-start justify-between">
            <CardHeader className="p-0!">
                <CardTitle className="line-clamp-1 text-base">{name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs text-muted-foreground">{description}</CardDescription>
            </CardHeader>

            {/* dekstop dropdown */}
            <Activity mode={!isMobile ? 'visible' : 'hidden'}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="z-10 shrink-0 cursor-pointer">
                            <EllipsisVertical size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {menus.map((menu) => (
                            <DropdownMenuItem key={menu.label} onClick={menu.onClick} className={menu.className}>
                                <menu.icon size={14} className={menu.iconClassName} /> {menu.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </Activity>

            {/* mobile drawer */}
            <Activity mode={isMobile ? 'visible' : 'hidden'}>
                <Button variant="ghost" size="icon" className="z-10 shrink-0 cursor-pointer" onClick={handleOpenDrawer}>
                    <EllipsisVertical size={18} />
                </Button>
            </Activity>
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
            <div className="absolute -top-8 -right-8 z-0 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            <CardContent className="relative z-10 flex h-full flex-col justify-between gap-4 p-6">
                <ServiceItemHeader {...props} onEdit={handleEdit} onDelete={handleDelete} />
                <ServiceItemFooter formattedPrice={formattedPrice} unit={props.unit} time={props.time} />
            </CardContent>
            <div className="absolute bottom-0 left-0 z-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
        </Card>
    );
}
