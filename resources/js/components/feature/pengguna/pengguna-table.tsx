import { router, usePage } from '@inertiajs/react';
import { Eye, Pencil, UserRoundX } from 'lucide-react';
import type { BadgeVariant } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types/feature/user/user';
import { UserRole, UserStatusIndonesian } from '@/types/feature/user/user';
import type { PenggunaSectionProps } from './pengguna-section';
import pengguna from '@/routes/pengguna';

export function getStatusBadgeVariant(status: UserStatusIndonesian): BadgeVariant {
    switch (status) {
        case UserStatusIndonesian.ACTIVE:
            return 'default';
        case UserStatusIndonesian.INACTIVE:
            return 'secondary';
        case UserStatusIndonesian.SUSPENDED:
            return 'destructive';
        default:
            return 'outline';
    }
}

export function getStatusBadgeClass(status: UserStatusIndonesian): string {
    const badgeStatusStyle: Record<UserStatusIndonesian, string> = {
        [UserStatusIndonesian.ACTIVE]:
            'border-emerald-500 min-w-32 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        [UserStatusIndonesian.INACTIVE]: 'border-gray-400 min-w-32 bg-gray-400/10 text-gray-600 dark:text-gray-400',
        [UserStatusIndonesian.SUSPENDED]: 'border-red-500 min-w-32 bg-red-500/10 text-red-600 dark:text-red-400',
    };

    return badgeStatusStyle[status] ?? '';
}

export function getRoleBadgeVariant(role: UserRole): BadgeVariant {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return 'default';
        case UserRole.GHOST:
            return 'secondary';
        default:
            return 'outline';
    }
}

function PenggunaTableEmpty() {
    return (
        <Empty className="h-auto w-full bg-muted/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserRoundX />
                </EmptyMedia>
                <EmptyTitle>Belum ada pengguna</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    Anda belum memiliki pengguna. Silahkan tambahkan pengguna untuk memulai.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

function PenggunaTableHead() {
    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="text-center text-xs">No</TableHead>
                <TableHead className="text-center text-xs">Nama</TableHead>
                <TableHead className="text-center text-xs">Email</TableHead>
                <TableHead className="text-center text-xs">Penampatan</TableHead>
                <TableHead className="text-center text-xs">Role</TableHead>
                <TableHead className="text-center text-xs">Status</TableHead>
                <TableHead className="text-center text-xs">Aksi</TableHead>
            </TableRow>
        </TableHeader>
    );
}

interface PenggunaTableBodyProps {
    usersData: User[];
}

function PenggunaTableBody({ usersData }: PenggunaTableBodyProps) {
    const { auth } = usePage().props;
    const userId = auth.user.id;

    const handleGoToEdit = (id: number) => () => {
        router.get(pengguna.edit(id).url);
    };

    const handleGoToView = (id: number) => () => {
        router.get(pengguna.show(id).url);
    };

    return (
        <TableBody>
            {usersData.map((user, index) => {
                const isIdSame = user.id === userId;

                return (
                    <TableRow key={user.id} className="group transition-colors">
                        <TableCell className="text-center font-mono text-xs font-semibold whitespace-nowrap text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell className="text-center font-medium">{user.name}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                            {user?.outlet?.name ?? '-'}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                className="w-full max-w-36 py-1 font-medium"
                                variant={getRoleBadgeVariant(user.role.value)}
                            >
                                {user.role.label}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant={getStatusBadgeVariant(user.status.label)}
                                className={getStatusBadgeClass(user.status.label)}
                            >
                                {user.status.label}
                            </Badge>
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" onClick={handleGoToView(user.id)}>
                                    <Eye />
                                </Button>
                                <Button
                                    size="icon"
                                    disabled={isIdSame}
                                    variant="secondary"
                                    onClick={handleGoToEdit(user.id)}
                                >
                                    <Pencil />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export function PenggunaTable() {
    const { users } = usePage<PenggunaSectionProps>().props;
    const { data: usersData } = users;

    if (!usersData.length) {
        return <PenggunaTableEmpty />;
    }

    return (
        <Table>
            <PenggunaTableHead />
            <PenggunaTableBody usersData={usersData} />
        </Table>
    );
}
