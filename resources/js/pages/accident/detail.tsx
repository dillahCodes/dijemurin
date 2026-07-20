import { Head, usePage } from '@inertiajs/react';
import { AccidentDetailSection } from '@/components/feature/accident/detail/accident-detail-section';
import AppLayout from '@/layouts/app-layout';
import accidents from '@/routes/accidents';
import type { AccidentDetail } from '@/types/feature/accident/accident';
import type { ApiResponse } from '@/types/response';

export type AccidentDetailPageProps = {
    accident: ApiResponse<AccidentDetail>;
};

export default function AccidentShow() {
    const { accident } = usePage<AccidentDetailPageProps>().props;
    const { data: accidentData } = accident;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Laporan Insiden', href: accidents.index().url },
                { title: `Detail Insiden #${accidentData.id}`, href: '' },
            ]}
        >
            <Head title={`Detail Insiden #${accidentData.id}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <AccidentDetailSection />
            </section>
        </AppLayout>
    );
}
