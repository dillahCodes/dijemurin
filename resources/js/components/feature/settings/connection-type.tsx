import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ConnectionType } from '@/context/feature/printer/connection-type-context';
import { ConnectionTypeEnum, useConnectionType } from '@/context/feature/printer/connection-type-context';

const CONNECTION_TYPES = [
    { value: ConnectionTypeEnum.BLUETOOTH, label: ConnectionTypeEnum.BLUETOOTH.toLocaleLowerCase() },
    { value: ConnectionTypeEnum.USB, label: ConnectionTypeEnum.USB.toLocaleLowerCase() },
];

export function ConnectionType() {
    const { state, dispatch } = useConnectionType();

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Tipe Koneksi</CardTitle>
            </CardHeader>

            <CardContent className="my-2 flex flex-col gap-4">
                <RadioGroup
                    value={state.connection_type}
                    onValueChange={(value: ConnectionType) => dispatch({ type: 'SET_CONNECTION_TYPE', payload: value })}
                    className="flex items-center gap-4"
                >
                    {CONNECTION_TYPES.map((type) => (
                        <div key={type.value} className="flex cursor-pointer items-center gap-3">
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label htmlFor={type.value} className="cursor-pointer">
                                {type.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
}
