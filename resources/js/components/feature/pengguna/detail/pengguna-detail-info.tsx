import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/helper/formatted-date';
import { cn } from '@/lib/utils';
import { User } from '@/types/feature/user/user';
import type { ApiResponse } from '@/types/response';
import { getStatusBadgeClass, getStatusBadgeVariant } from '../pengguna-table';

export type PenggunaDetailPageProps = {
    user: ApiResponse<User>;
};

interface InfoRowProps {
    label: string;
    children: React.ReactNode;
    colSpan?: 'full' | 'half';
}

function InfoRow({ label, children, colSpan = 'half' }: InfoRowProps) {
    return (
        <div className={cn('flex flex-col gap-1.5', colSpan === 'full' ? 'col-span-2' : 'col-span-2 sm:col-span-1')}>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {children}
        </div>
    );
}

export function PenggunaDetailInfo() {
    const { user } = usePage<PenggunaDetailPageProps>().props;
    const { data: userData } = user;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <InfoRow label="Nama">
                        <p className="text-lg font-semibold tracking-tight text-foreground">{userData.name}</p>
                    </InfoRow>

                    <InfoRow label="Email">
                        <p className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground">{userData.email}</p>
                    </InfoRow>

                    <InfoRow label="Role">
                        <p className="text-lg font-semibold tracking-tight text-foreground">{userData.role.label}</p>
                    </InfoRow>

                    <InfoRow label="Outlet">
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                            {userData.outlet?.name ?? '-'}
                        </p>
                    </InfoRow>

                    <InfoRow label="Status">
                        <div>
                            <Badge
                                variant={getStatusBadgeVariant(userData.status.label)}
                                className={cn(getStatusBadgeClass(userData.status.label), 'shadow-sm')}
                            >
                                {userData.status.label}
                            </Badge>
                        </div>
                    </InfoRow>

                    <InfoRow label="Email Terverifikasi">
                        <p className="text-lg font-semibold tracking-tight text-foreground">
                            {userData.email_verified_at ? formatDate(userData.email_verified_at) : '-'}
                        </p>
                    </InfoRow>

                    <InfoRow label="Tanggal Dibuat">
                        <p className="text-sm font-medium text-foreground sm:text-base">{formatDate(userData.created_at)}</p>
                    </InfoRow>

                    <InfoRow label="Tanggal Diubah">
                        <p className="text-sm font-medium text-foreground sm:text-base">{formatDate(userData.updated_at)}</p>
                    </InfoRow>
                </div>
            </CardContent>
        </Card>
    );
}
