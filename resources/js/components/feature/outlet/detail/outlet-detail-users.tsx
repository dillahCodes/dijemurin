import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types/feature/user/user';
import { getRoleBadgeVariant, getStatusBadgeClass, getStatusBadgeVariant } from '../../pengguna/pengguna-table';
import type { OutletDetailPageProps } from './outlet-detail-section';

function OutletDetailUsersHead() {
    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="w-20 text-center text-xs">No</TableHead>
                <TableHead className="text-center text-xs">Nama</TableHead>
                <TableHead className="text-center text-xs">Email</TableHead>
                <TableHead className="text-center text-xs">Role</TableHead>
                <TableHead className="text-center text-xs">Status</TableHead>
            </TableRow>
        </TableHeader>
    );
}

interface PenggunaTableBodyProps {
    usersData: User[];
}

function PenggunaTableBody({ usersData }: PenggunaTableBodyProps) {
    return (
        <TableBody>
            {usersData.map((user, index) => {
                return (
                    <TableRow key={user.id} className="group transition-colors">
                        <TableCell className="text-center font-mono text-xs font-semibold whitespace-nowrap text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell className="text-center font-medium">{user.name}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">{user.email}</TableCell>
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
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export function OutletDetailUsers() {
    const { outletDetail } = usePage<OutletDetailPageProps>().props;
    const { data: outletDetailData } = outletDetail;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <OutletDetailUsersHead />
                    <PenggunaTableBody usersData={outletDetailData.users} />
                </Table>
            </CardContent>
        </Card>
    );
}
