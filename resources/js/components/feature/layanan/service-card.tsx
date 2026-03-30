import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { Activity } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDrawer } from '@/components/ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useServiceActions } from '@/hooks/feature/layanan/use-service-actions';
import type { ServiceCardProps } from '@/hooks/feature/layanan/use-service-actions';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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

interface ServiceHeaderContentProps {
    title: string;
    description: string;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

/** 2. Sub-components (UI Units) */
function ServiceHeaderContent({ title, description, onEdit, onDelete }: ServiceHeaderContentProps) {
    const isMobile = useIsMobile();
    const drawer = useDrawer();

    const menus = getMenus({ handleEdit: onEdit, handleDelete: onDelete });

    const handleOpenDrawer = (e: React.MouseEvent) => {
        e.stopPropagation();
        drawer.open({
            id: 'service-drawer',
            wrapperClassName: 'rounded-t-xl p-3',
            content: <DrawerContent menu={menus} />,
        });
    };

    return (
        <div className="flex w-full items-center justify-between">
            <CardHeader className="p-0!">
                <CardTitle className="line-clamp-1 text-sm sm:text-base md:text-lg">{title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs text-muted-foreground sm:text-sm md:text-base">
                    {description}
                </CardDescription>
            </CardHeader>

            {/* dekstop dropdown menu, mobile bottom sheet */}
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

            {/* mobile bottom sheet */}
            <Activity mode={isMobile ? 'visible' : 'hidden'}>
                <Button variant="ghost" size="icon" className="z-10 shrink-0 cursor-pointer" onClick={handleOpenDrawer}>
                    <EllipsisVertical size={18} />
                </Button>
            </Activity>
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
            <div className="absolute -top-8 -right-8 z-0 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            <div className="absolute bottom-0 left-0 z-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
            <ServiceHeaderContent {...props} onEdit={handleEdit} onDelete={handleDelete} />
        </Card>
    );
}
