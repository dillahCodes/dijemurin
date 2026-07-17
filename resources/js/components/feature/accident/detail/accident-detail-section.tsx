import { usePage } from '@inertiajs/react';
import { AccidentDetailHeader } from '@/components/feature/accident/detail/accident-detail-header';
import { AccidentInfo } from '@/components/feature/accident/detail/accident-info';
import { AccidentItemsTable } from '@/components/feature/accident/detail/accident-items-table';
import { AccidentTimeline } from '@/components/feature/accident/detail/accident-timeline';
import type { AccidentDetailPageProps } from '@/pages/accident/detail';

export function AccidentDetailSection() {
    const { accident } = usePage<AccidentDetailPageProps>().props;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <AccidentDetailHeader />
            </div>

            <div className="flex flex-col gap-6">
                <AccidentInfo accident={accident.data} />
                <AccidentTimeline accident={accident.data} />
                <AccidentItemsTable items={accident.data.items || []} />
            </div>
        </div>
    );
}
