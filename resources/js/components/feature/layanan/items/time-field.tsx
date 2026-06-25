import { Activity } from 'react';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceTimeType, ServiceTimeTypeIndonesian } from '@/types/feature/layanan';

interface TimeFieldProps {
    valueNumber: number;
    valueType: ServiceTimeType;
    errorNumber?: string;
    errorType?: string;
    onChangeNumber: (val: number) => void;
    onChangeType: (val: ServiceTimeType) => void;
}

export function TimeField({ valueNumber, valueType, errorNumber, errorType, onChangeNumber, onChangeType }: TimeFieldProps) {
    return (
        <Field data-invalid={!!errorNumber || !!errorType}>
            <FieldLabel htmlFor="time_number">
                Waktu Pengerjaan <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="flex w-full gap-2">
                <Input
                    className="w-1/2"
                    aria-invalid={!!errorNumber}
                    onChange={(e) => onChangeNumber(Number(e.target.value) || 0)}
                    id="time_number"
                    type="number"
                    min={1}
                    value={valueNumber || ''}
                    placeholder="Contoh: 4"
                />
                <Select value={valueType} onValueChange={onChangeType}>
                    <SelectTrigger id="time_type" className="w-1/2 cursor-pointer">
                        <SelectValue placeholder="Pilih Tipe" />
                    </SelectTrigger>
                    <SelectContent className="z-2000">
                        {Object.entries(ServiceTimeTypeIndonesian).map(([key, label]) => {
                            const val = ServiceTimeType[key as keyof typeof ServiceTimeType];
                            return (
                                <SelectItem key={val} value={val}>
                                    {label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <Activity mode={errorNumber ? 'visible' : 'hidden'}>
                <FieldDescription className="text-destructive">{errorNumber}</FieldDescription>
            </Activity>
            <Activity mode={errorType ? 'visible' : 'hidden'}>
                <FieldDescription className="text-destructive">{errorType}</FieldDescription>
            </Activity>
        </Field>
    );
}
