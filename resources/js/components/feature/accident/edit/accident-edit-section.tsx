import type { Accident, AccidentTypeOption, AccidentTransitionRules } from '@/types/feature/accident/accident';
import { AccidentEditForm } from './accident-edit-form';
import { AccidentEditHeader } from './accident-edit-header';

interface OptionItem {
    label: string;
    value: string;
}

export type AccidentEditSectionProps = {
    accident: Accident;
    accidentTypeOptions: AccidentTypeOption[];
    accidentStatusOptions: OptionItem[];
    compensationTypeOptions: OptionItem[];
    accidentTransitionRules: AccidentTransitionRules;
};

export function AccidentEditSection({
    accident,
    accidentTypeOptions,
    accidentStatusOptions,
    compensationTypeOptions,
    accidentTransitionRules,
}: AccidentEditSectionProps) {
    return (
        <div className="flex flex-col gap-6">
            <AccidentEditHeader id={accident.id} />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <AccidentEditForm
                    accident={accident}
                    accidentTypeOptions={accidentTypeOptions}
                    accidentStatusOptions={accidentStatusOptions}
                    compensationTypeOptions={compensationTypeOptions}
                    accidentTransitionRules={accidentTransitionRules}
                />
            </div>
        </div>
    );
}
