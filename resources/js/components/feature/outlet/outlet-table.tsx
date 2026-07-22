import { router, usePage } from '@inertiajs/react';
import { Eye, Image, Pencil, UserRoundX } from 'lucide-react';
import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { OutletStatusOptionIndonesian } from '@/types/feature/outlet/outlet';
import type { OutletSectionProps } from './outlet-section';
import outlet from '@/routes/outlet';

export function getStatusBadgeVariant(status: OutletStatusOptionIndonesian): BadgeVariant {
    switch (status) {
        case OutletStatusOptionIndonesian.ACTIVE:
            return 'default';
        case OutletStatusOptionIndonesian.INACTIVE:
            return 'secondary';
        default:
            return 'outline';
    }
}

export function getStatusBadgeClass(status: OutletStatusOptionIndonesian): string {
    const badgeStatusStyle: Record<OutletStatusOptionIndonesian, string> = {
        [OutletStatusOptionIndonesian.ACTIVE]:
            'border-emerald-500 min-w-32 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        [OutletStatusOptionIndonesian.INACTIVE]: 'border-gray-400 min-w-32 bg-gray-400/10 text-gray-600 dark:text-gray-400',
    };

    return badgeStatusStyle[status] ?? '';
}

function OutletTableEmpty() {
    return (
        <Empty className="h-auto w-full bg-muted/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserRoundX />
                </EmptyMedia>
                <EmptyTitle>Belum ada Outlet</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    Anda belum memiliki Outlet. Silahkan tambahkan Outlet untuk memulai.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

function OutletTableHead() {
    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px] text-center text-xs">No</TableHead>
                <TableHead className="w-[80px] text-center text-xs">Logo</TableHead>
                <TableHead className="w-[200px] text-center text-xs">Nama</TableHead>
                <TableHead className="w-[200px] text-center text-xs">Alamat</TableHead>
                <TableHead className="w-[150px] text-center text-xs">Email</TableHead>
                <TableHead className="w-[150px] text-center text-xs">No. Telepon</TableHead>
                <TableHead className="w-[120px] text-center text-xs">Status</TableHead>
                <TableHead className="w-[120px] text-center text-xs">Aksi</TableHead>
            </TableRow>
        </TableHeader>
    );
}

interface OutletLogoProps {
    picture: string | null;
    name: string;
}

function OutletLogo({ picture, name }: OutletLogoProps) {
    if (!picture) {
        return (
            <div className="mx-auto flex aspect-square size-10 items-center justify-center rounded-md bg-muted">
                <Image className="size-5 text-muted-foreground" />
            </div>
        );
    }

    return (
        <img
            src={picture}
            alt={`Logo ${name}`}
            className="mx-auto size-10 rounded-md object-cover shadow-sm"
            loading="lazy"
            decoding="async"
        />
    );
}

interface OutletTableBodyProps {
    outletData: Outlet[];
}

function OutletTableBody({ outletData }: OutletTableBodyProps) {
    const handleGoToView = (index: number) => () => {
        router.get(outlet.show(index).url);
    };

    const handleGoToEdit = (index: number) => () => {
        router.get(outlet.edit(index).url);
    };

    return (
        <TableBody>
            {outletData.map((outlet, index) => {
                return (
                    <TableRow key={outlet.id} className="group transition-colors">
                        <TableCell className="text-center font-mono text-xs font-semibold whitespace-nowrap text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                            <OutletLogo picture={outlet.picture} name={outlet.name} />
                        </TableCell>
                        <TableCell className="text-center font-medium">
                            <p className="line-clamp-2">{outlet.name}</p>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                            <p className="line-clamp-2">{outlet.address}</p>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                            <p className="line-clamp-2">{outlet.email || '-'}</p>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                            <p className="line-clamp-2">{outlet.phone || '-'}</p>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant={getStatusBadgeVariant(outlet.status.label)}
                                className={getStatusBadgeClass(outlet.status.label)}
                            >
                                {outlet.status.label}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-2">
                                <Button size="icon" variant="outline" onClick={handleGoToView(outlet.id)}>
                                    <Eye size={16} />
                                </Button>
                                <Button size="icon" variant="secondary" onClick={handleGoToEdit(outlet.id)}>
                                    <Pencil size={16} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export function OutletTable() {
    const { outlets } = usePage<OutletSectionProps>().props;
    const { data: outletsData } = outlets;

    if (!outletsData.length) {
        return <OutletTableEmpty />;
    }

    return (
        <Table>
            <OutletTableHead />
            <OutletTableBody outletData={outletsData} />
        </Table>
    );
}
