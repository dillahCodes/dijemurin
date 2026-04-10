export {};

declare global {
    interface Navigator {
        readonly usb: USB;
    }

    interface USB extends EventTarget {
        onconnect: ((this: this, ev: Event) => void) | null;
        ondisconnect: ((this: this, ev: Event) => void) | null;
        getDevices(): Promise<USBDevice[]>;
        requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice>;
    }

    interface USBDeviceRequestOptions {
        filters: USBDeviceFilter[];
        exclusionFilters?: USBDeviceFilter[];
    }

    interface USBDeviceFilter {
        vendorId?: number;
        productId?: number;
        classCode?: number;
        subclassCode?: number;
        protocolCode?: number;
        serialNumber?: string;
    }

    interface USBDevice {
        readonly vendorId: number;
        readonly productId: number;
        readonly manufacturerName?: string;
        readonly productName?: string;
        readonly serialNumber?: string;
        readonly opened: boolean;
        readonly configuration?: USBConfiguration;
        readonly configurations: USBConfiguration[];
        readonly usbVersionMajor: number;
        readonly usbVersionMinor: number;
        readonly usbVersionSubminor?: number;
        readonly deviceVersionMajor: number;
        readonly deviceVersionMinor?: number;
        readonly deviceVersionSubminor?: number;
        readonly deviceClass?: number;
        readonly deviceSubclass?: number;
        readonly deviceProtocol?: number;

        open(): Promise<void>;
        close(): Promise<void>;
        selectConfiguration(configurationValue: number): Promise<void>;
        claimInterface(interfaceNumber: number): Promise<void>;
        releaseInterface(interfaceNumber: number): Promise<void>;
        selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
        controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
        controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
        clearHalt(direction: 'in' | 'out', endpointNumber: number): Promise<void>;
        transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
        transferOut(
            endpointNumber: number,
            data: BufferSource | ArrayBufferLike | Uint8Array,
        ): Promise<USBOutTransferResult>;
        isochronousTransferIn(endpointNumber: number, packetLengths: number[]): Promise<USBIsochronousInTransferResult>;
        isochronousTransferOut(
            endpointNumber: number,
            data: BufferSource,
            packetLengths: number[],
        ): Promise<USBIsochronousOutTransferResult>;
        reset(): Promise<void>;
        forget(): Promise<void>;
    }

    interface USBConfiguration {
        readonly configurationValue: number;
        readonly configurationName?: string;
        readonly interfaces: USBInterface[];
    }

    interface USBInterface {
        readonly interfaceNumber: number;
        readonly alternate: USBAlternateInterface;
        readonly alternates: USBAlternateInterface[];
        readonly claimed: boolean;
    }

    interface USBAlternateInterface {
        readonly alternateSetting: number;
        readonly interfaceClass: number;
        readonly interfaceSubclass: number;
        readonly interfaceProtocol: number;
        readonly interfaceName?: string;
        readonly endpoints: USBEndpoint[];
    }

    interface USBEndpoint {
        readonly endpointNumber: number;
        readonly direction: 'in' | 'out';
        readonly type: 'bulk' | 'interrupt' | 'isochronous' | 'control';
        readonly packetSize: number;
    }

    interface USBControlTransferParameters {
        requestType: 'standard' | 'class' | 'vendor';
        recipient: 'device' | 'interface' | 'endpoint' | 'other';
        request: number;
        value: number;
        index: number;
    }

    interface USBTransferStatus {
        readonly status: 'ok' | 'stall' | 'babble';
    }

    interface USBInTransferResult extends USBTransferStatus {
        readonly data?: DataView;
    }

    interface USBOutTransferResult extends USBTransferStatus {
        readonly bytesWritten: number;
    }

    interface USBIsochronousInTransferResult {
        readonly data?: DataView;
        readonly packets: USBIsochronousInTransferPacket[];
    }

    interface USBIsochronousOutTransferResult {
        readonly packets: USBIsochronousOutTransferPacket[];
    }

    interface USBIsochronousInTransferPacket extends USBTransferStatus {
        readonly data?: DataView;
    }

    interface USBIsochronousOutTransferPacket extends USBTransferStatus {
        readonly bytesWritten: number;
    }
}
