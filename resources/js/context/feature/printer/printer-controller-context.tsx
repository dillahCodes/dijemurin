import { createContext, useContext } from 'react';
import { useConnectBluetooth } from '@/hooks/feature/printer/use-connect-bluetooth';
import { useConnectUsb } from '@/hooks/feature/printer/use-connect-usb';
import { ConnectionTypeEnum, useConnectionType } from './connection-type-context';

interface PrinterControllerContextValue {
    isBluetoothType: boolean;
    isDeviceConected: boolean;
    isConnecting: boolean;
    isPrinting: boolean;
    handleConnect: () => Promise<void>;
    handleDisconnect: () => Promise<void>;
    handlePrint: (data: Uint8Array, order_code: string) => Promise<void>;
    bluetoothDevice: BluetoothDevice | null;
    usbDevice: USBDevice | null;
}

const PrinterControllerContext = createContext<PrinterControllerContextValue | null>(null);

export function PrinterControllerProvider({ children }: { children: React.ReactNode }) {
    const { state } = useConnectionType();

    const {
        device: usbDevice,
        print: usbPrint,
        isConnected: isUsbConnected,
        connect: connectUsb,
        disconnect: disconnectUsb,
        status: usbStatus,
        printStatus: usbPrintStatus,
    } = useConnectUsb();

    const {
        device: bluetoothDevice,
        print: bluetoothPrint,
        isConnected: isBluetoothConnected,
        connect: connectBluetooth,
        disconnect: disconnectBluetooth,
        status: bluetoothStatus,
        printStatus: bluetoothPrintStatus,
    } = useConnectBluetooth();

    const isBluetoothType = state.connection_type === ConnectionTypeEnum.BLUETOOTH;

    const isDeviceConected = isBluetoothType ? isBluetoothConnected : isUsbConnected;
    const isConnecting = isBluetoothType ? bluetoothStatus === 'connecting' : usbStatus === 'connecting';
    const isPrinting = isBluetoothType ? bluetoothPrintStatus === 'printing' : usbPrintStatus === 'printing';

    const handleConnect = isBluetoothType ? connectBluetooth : connectUsb;
    const handleDisconnect = isBluetoothType ? disconnectBluetooth : disconnectUsb;
    const handlePrint = isBluetoothType ? bluetoothPrint : usbPrint;

    return (
        <PrinterControllerContext.Provider
            value={{
                isPrinting,
                isBluetoothType,
                isDeviceConected,
                isConnecting,
                handleConnect,
                handleDisconnect,
                handlePrint,
                usbDevice,
                bluetoothDevice,
            }}
        >
            {children}
        </PrinterControllerContext.Provider>
    );
}

export function usePrinterController() {
    const context = useContext(PrinterControllerContext);

    if (!context) {
        throw new Error('usePrinterController must be used within a PrinterControllerProvider');
    }

    return context;
}
