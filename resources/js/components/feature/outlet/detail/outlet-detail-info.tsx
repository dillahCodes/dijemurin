import { usePage } from '@inertiajs/react';
import { Calculator, Image, ShieldCheck, UserCog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/helper/formatted-date';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/feature/user/user';
import { getStatusBadgeClass, getStatusBadgeVariant } from '../outlet-table';
import type { OutletDetailPageProps } from './outlet-detail-section';

interface OutletInfoLogoProps {
    logo: string | null;
    name: string;
}

function OutletInfoLogo({ logo, name }: OutletInfoLogoProps) {
    if (!logo) {
        return (
            <div className="flex size-32 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/50 sm:size-36">
                <Image className="size-10 text-muted-foreground/60" />
            </div>
        );
    }

    return (
        <img
            src={logo}
            alt={`Logo ${name}`}
            className="size-32 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-border/10 sm:size-36"
            loading="lazy"
            decoding="async"
        />
    );
}

interface RoleStatCardProps {
    title: string;
    count: number;
    icon: LucideIcon;
    colorClass: string;
}

function RoleStatCard({ title, count, icon: Icon, colorClass }: RoleStatCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs transition-all hover:shadow-md">
            <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', colorClass)}>
                <Icon className="size-6" />
            </div>
            <div>
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <p className="text-2xl font-bold tracking-tight text-foreground">{count}</p>
            </div>
        </div>
    );
}
export function OutletInfo() {
    const { outletDetail } = usePage<OutletDetailPageProps>().props;
    const { data: outletDetailData } = outletDetail;

    const userRoleCount = (role: UserRole) => {
        return outletDetailData.users.filter((user) => user.role.value === role).length;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Outlet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {/* INFO SECTION */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <div className="flex justify-center sm:justify-start">
                        <OutletInfoLogo logo={outletDetailData.logo} name={outletDetailData.name} />
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6 lg:max-w-2xl">
                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                            <span className="text-sm font-medium text-muted-foreground">Nama Outlet</span>
                            <p className="text-lg font-semibold tracking-tight text-foreground">{outletDetailData.name}</p>
                        </div>

                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <div>
                                <Badge
                                    variant={getStatusBadgeVariant(outletDetailData.status.label)}
                                    className={cn(getStatusBadgeClass(outletDetailData.status.label), 'shadow-sm')}
                                >
                                    {outletDetailData.status.label}
                                </Badge>
                            </div>
                        </div>

                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                            <span className="text-sm font-medium text-muted-foreground">Alamat</span>
                            <p className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                                {outletDetailData.address}
                            </p>
                        </div>

                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <p className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground">
                                {outletDetailData.email}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground sm:text-sm">Tanggal dibuat</span>
                            <p className="text-sm font-medium text-foreground sm:text-base">
                                {formatDate(outletDetailData.created_at)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground sm:text-sm">Tanggal diubah</span>
                            <p className="text-sm font-medium text-foreground sm:text-base">
                                {formatDate(outletDetailData.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATISTICS SECTION */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <RoleStatCard
                        title="Admin"
                        count={userRoleCount(UserRole.ADMIN)}
                        icon={ShieldCheck}
                        colorClass="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    />
                    <RoleStatCard
                        title="Kasir"
                        count={userRoleCount(UserRole.CASHIER)}
                        icon={Calculator}
                        colorClass="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    />
                    <RoleStatCard
                        title="Operator"
                        count={userRoleCount(UserRole.OPERATOR)}
                        icon={UserCog}
                        colorClass="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
