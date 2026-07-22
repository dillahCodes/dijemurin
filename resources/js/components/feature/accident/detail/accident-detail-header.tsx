import { Link, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { RoleHelper } from '@/helper/role-helper';
import type { AccidentDetailPageProps } from '@/pages/accident/detail';
import { AccidentStatusEnglish } from '@/types/feature/accident/accident';
import { UserRole } from '@/types/feature/user/user';
import accidents from '@/routes/accidents';

export function AccidentDetailHeader() {
    const { accident, auth } = usePage<AccidentDetailPageProps>().props;
    const accidentData = accident.data;

    const isAdmin = RoleHelper.hasRoles(auth.user, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    const isReporter = accidentData.reporter_id === auth.user.id;
    const isEditableStatus = [AccidentStatusEnglish.PENDING].includes(accidentData.status.value);

    const isReporterEditable = [isReporter, isEditableStatus].every(Boolean);
    const showEditButton = [isReporterEditable, isAdmin].some(Boolean);

    return (
        <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">
                    Detail Laporan Insiden
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Informasi detail mengenai kejadian, status penanganan, dan penyelesaian insiden.
                </p>
            </div>

            <Activity mode={showEditButton ? 'visible' : 'hidden'}>
                <Button asChild variant="outline" size="sm">
                    <Link href={accidents.edit(accidentData.id).url}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Laporan
                    </Link>
                </Button>
            </Activity>
        </div>
    );
}
