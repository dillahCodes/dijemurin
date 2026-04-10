export {};
declare global {
    interface Navigator {
        readonly bluetooth: Bluetooth;
    }
    interface Bluetooth extends EventTarget {
        getDevices(): Promise<BluetoothDevice[]>;
        requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
    }
    interface RequestDeviceOptions {
        filters?: BluetoothLEScanFilter[];
        optionalServices?: BluetoothServiceUUID[];
        acceptAllDevices?: boolean;
    }
    interface BluetoothLEScanFilter {
        name?: string;
        namePrefix?: string;
        services?: BluetoothServiceUUID[];
    }
    type BluetoothServiceUUID = number | string;
    interface BluetoothDevice extends EventTarget {
        readonly id: string;
        readonly name?: string;
        readonly gatt?: BluetoothRemoteGATTServer;
        forget?(): Promise<void>;
    }
    interface BluetoothRemoteGATTServer {
        readonly device: BluetoothDevice;
        readonly connected: boolean;
        connect(): Promise<BluetoothRemoteGATTServer>;
        disconnect(): void;
        getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
    }
    interface BluetoothRemoteGATTService {
        readonly uuid: string;
        getCharacteristic(characteristic: BluetoothServiceUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    }
    interface BluetoothRemoteGATTCharacteristic {
        readonly uuid: string;
        writeValue?(value: BufferSource): Promise<void>;
        writeValueWithoutResponse?(value: BufferSource): Promise<void>;
    }
}
