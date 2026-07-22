import { Head } from '@inertiajs/react';
import { AccidentEditSection } from '@/components/feature/accident/edit/accident-edit-section';
import AppLayout from '@/layouts/app-layout';
import type { Accident, AccidentTypeOption, AccidentTransitionRules } from '@/types/feature/accident/accident';
import type { ApiResponse } from '@/types/response';
import accidents from '@/routes/accidents';

interface OptionItem {
    label: string;
    value: string;
}

export type AccidentEditPageProps = {
    accident: ApiResponse<Accident>;
    accidentTypeOptions: AccidentTypeOption[];
    accidentStatusOptions: OptionItem[];
    compensationTypeOptions: OptionItem[];
    accidentTransitionRules: AccidentTransitionRules;
};

export default function AccidentEdit({
    accident,
    accidentTypeOptions,
    accidentStatusOptions,
    compensationTypeOptions,
    accidentTransitionRules,
}: AccidentEditPageProps) {
    const accidentData = accident.data;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Laporan Insiden', href: accidents.index().url },
                { title: `Ubah Laporan Insiden #${accidentData.id}`, href: '' },
            ]}
        >
            <Head title={`Ubah Laporan Insiden #${accidentData.id}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <AccidentEditSection
                    accident={accidentData}
                    accidentTypeOptions={accidentTypeOptions}
                    accidentStatusOptions={accidentStatusOptions}
                    compensationTypeOptions={compensationTypeOptions}
                    accidentTransitionRules={accidentTransitionRules}
                />
            </section>
        </AppLayout>
    );
}
