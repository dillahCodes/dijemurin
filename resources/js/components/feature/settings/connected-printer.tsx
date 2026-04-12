import { Bluetooth, LoaderCircle, Plug, Printer, PrinterCheck, Unplug, Usb } from 'lucide-react';
import { Activity } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrinterController } from '@/context/feature/printer/printer-controller-context';
import { Button } from '../../ui/button';

export function ConnectedPrinter() {
    const { isBluetoothType, isDeviceConected, isConnecting, handleConnect, handleDisconnect, bluetoothDevice, usbDevice } =
        usePrinterController();

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Printer Terhubung</CardTitle>
                <CardDescription>Printer yang terhubung dengan perangkat</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-md border p-2">
                    <div className="flex aspect-square h-14 w-fit items-center justify-center rounded-md bg-slate-100 p-2">
                        <Activity mode={!isDeviceConected ? 'visible' : 'hidden'}>
                            <Printer className="size-6 text-slate-500" />
                        </Activity>

                        <Activity mode={isDeviceConected ? 'visible' : 'hidden'}>
                            <PrinterCheck className="size-6 text-slate-500" />
                        </Activity>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-muted-foreground">
                            {isDeviceConected ? 'Terhubung' : 'Tidak Terhubung'}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Activity mode={isBluetoothType ? 'visible' : 'hidden'}>
                                <Bluetooth className="size-3.5" />
                                <span>{isDeviceConected ? bluetoothDevice?.name : '---'}</span>
                            </Activity>
                            <Activity mode={!isBluetoothType ? 'visible' : 'hidden'}>
                                <Usb className="size-3.5" />
                                <span>{isDeviceConected ? usbDevice?.productName : '---'}</span>
                            </Activity>
                        </p>
                    </div>

                    <Activity mode={!isDeviceConected ? 'visible' : 'hidden'}>
                        <Button disabled={isConnecting} size="sm" className="ml-auto" onClick={() => handleConnect()}>
                            {isConnecting ? <LoaderCircle className="size-4 animate-spin" /> : <Plug className="size-4" />}
                        </Button>
                    </Activity>

                    <Activity mode={isDeviceConected ? 'visible' : 'hidden'}>
                        <Button variant="destructive" size="sm" className="ml-auto" onClick={() => handleDisconnect()}>
                            <Unplug className="size-4" />
                            Putuskan
                        </Button>
                    </Activity>
                </div>
            </CardContent>
        </Card>
    );
}
