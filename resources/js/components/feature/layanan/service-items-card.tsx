import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ServiceItemCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    time: string;
}

export function ServiceItemCard({
    name,
    description,
    price,
    unit,
    time,
}: ServiceItemCardProps) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: implement edit
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: implement delete
    };

    return (
        <Card
            className={cn(
                'group relative w-full border-sidebar-border/70 p-0! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
            )}
        >
            {/* Blur orb */}
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

            <CardContent className="relative z-10 flex h-full flex-col justify-between gap-4 p-6">
                {/* Top: name + description + dropdown */}
                <div className="flex items-start justify-between">
                    <CardHeader className="p-0!">
                        <CardTitle className="line-clamp-1 text-base">
                            {name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
                            {description}
                        </CardDescription>
                    </CardHeader>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="z-10 shrink-0 cursor-pointer"
                            >
                                <EllipsisVertical size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={handleEdit}
                                className="cursor-pointer"
                            >
                                <Pencil size={14} />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <Trash2
                                    size={14}
                                    className="text-destructive"
                                />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bottom: price + meta */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            {formattedPrice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            per {unit}
                        </span>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {time}
                    </span>
                </div>
            </CardContent>

            {/* Accent bar */}
            <div className="absolute bottom-0 left-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />
        </Card>
    );
}
