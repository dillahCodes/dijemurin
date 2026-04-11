import { useEffect, useRef, useState } from 'react';
import { EscPosStyling } from '@/helper/esc-pos-styling';
import { generateQrCodeFromString } from '@/helper/generate-qr-code-from-string';
import { convertImageToEscPosSharp } from '@/helper/image-to-esc-pos';
import order from '@/routes/order';

// ─── Konstanta ─────────────────────────────────────────────────────────────────
// NOTE: ketik di terminal `lsusb` untuk melihat vendor ID printer kamu, lalu ganti VENDOR_ID di bawah ini
const VENDOR_ID = 0x6868;

const BASE_PRINT_DELAY_MS = 2000;
const DELAY_MULTIPLIER_PER_BYTE = 0.5;
const MINIMUM_PRINT_DELAY_MS = 3000;
const MAXIMUM_PRINT_DELAY_MS = 15000;

// ─── Types ─────────────────────────────────────────────────────────────────────
export type UsbStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface UseConnectUsbReturn {
    device: USBDevice | null;
    status: UsbStatus;
    printStatus: 'idle' | 'printing';
    isConnected: boolean;
    errorMessage: string | null;
    connect: () => Promise<void>;
    print: (data: Uint8Array, order_code: string) => Promise<void>;
    disconnect: () => Promise<void>;
}

// ─── Helper: buka device & claim interface ─────────────────────────────────────
async function setupDevice(device: USBDevice): Promise<void> {
    if (!device.opened) {
        await device.open();
    }

    if (device.configuration === null) {
        await device.selectConfiguration(1);
    }

    await device.claimInterface(0);
}

// ─── Helper: ambil endpoint OUT ────────────────────────────────────────────────
function getEndpointOut(device: USBDevice): number {
    for (const iface of device.configuration?.interfaces || []) {
        for (const alt of iface.alternates) {
            for (const ep of alt.endpoints) {
                if (ep.direction === 'out') {
                    return ep.endpointNumber;
                }
            }
        }
    }

    throw new Error('Endpoint OUT tidak ditemukan');
}

// ─── Helper: simulasi estimasi waktu cetak mekanik ─────────────────────────────
function calculatePrintDelay(totalBytes: number): number {
    const calculatedDelay = BASE_PRINT_DELAY_MS + totalBytes * DELAY_MULTIPLIER_PER_BYTE;

    return Math.min(Math.max(calculatedDelay, MINIMUM_PRINT_DELAY_MS), MAXIMUM_PRINT_DELAY_MS);
}

/**
 * Hook untuk koneksi & komunikasi USB (WebUSB).
 *
 * @returns device, isConnected, status, connect, print, disconnect
 *
 * @example
 * const { connect, print, disconnect } = useConnectUsb();
 * await connect();
 * await print("Hello");
 * await disconnect();
 */
export function useConnectUsb(): UseConnectUsbReturn {
    const deviceRef = useRef<USBDevice | null>(null);
    const endpointRef = useRef<number | null>(null);

    const [device, setDevice] = useState<USBDevice | null>(null);
    const [status, setStatus] = useState<UsbStatus>('idle');
    const [printStatus, setPrintStatus] = useState<'idle' | 'printing'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ── Auto reconnect ──────────────────────────────────────────────────────────
    useEffect(() => {
        async function autoReconnect() {
            if (!('usb' in navigator)) {
                return;
            }

            const shouldAutoConnect = localStorage.getItem('usb_autoconnect') === 'true';

            if (!shouldAutoConnect) {
                return;
            }

            try {
                const devices = await navigator.usb.getDevices();
                const existingDevice = devices.find((d) => d.vendorId === VENDOR_ID) || devices[0];

                if (!existingDevice) {
                    return;
                }

                await setupDevice(existingDevice);

                const endpoint = getEndpointOut(existingDevice);

                deviceRef.current = existingDevice;
                endpointRef.current = endpoint;

                setDevice(existingDevice);
                setStatus('connected');
            } catch (error) {
                console.error('Auto reconnect gagal:', error);
            }
        }

        autoReconnect();
    }, []);

    // ── Connect ────────────────────────────────────────────────────────────────
    async function connect(): Promise<void> {
        if (deviceRef.current?.opened) {
            return;
        }

        if (!('usb' in navigator)) {
            const msg = 'WebUSB tidak didukung di browser ini.';
            setErrorMessage(msg);
            setStatus('error');

            return;
        }

        try {
            setStatus('connecting');
            setErrorMessage(null);

            const selectedDevice = await navigator.usb.requestDevice({
                filters: [{ vendorId: VENDOR_ID }],
            });

            await setupDevice(selectedDevice);

            const endpoint = getEndpointOut(selectedDevice);

            deviceRef.current = selectedDevice;
            endpointRef.current = endpoint;

            setDevice(selectedDevice);
            setStatus('connected');

            localStorage.setItem('usb_autoconnect', 'true');
        } catch (error: unknown) {
            console.error('Koneksi USB gagal:', error);

            if (error instanceof DOMException && error.name === 'NotFoundError') {
                setStatus('idle');

                return;
            }

            const msg = error instanceof Error ? error.message : 'Koneksi USB gagal.';

            setErrorMessage(msg);
            setStatus('error');

            deviceRef.current = null;
            endpointRef.current = null;
            setDevice(null);
        }
    }

    // ── Print ──────────────────────────────────────────────────────────────────
    async function print(data: Uint8Array, order_code: string): Promise<void> {
        if (!deviceRef.current?.opened) {
            await connect();
        }

        const dev = deviceRef.current;
        const endpoint = endpointRef.current;

        if (!dev || endpoint === null) {
            throw new Error('Printer tidak tersedia.');
        }

        const resetCmd = new Uint8Array([0x1b, 0x40]);
        const cutCmd = new Uint8Array([0x1d, 0x56, 0x42, 0x00]);

        const customerStatusPath = `${order.customer.status().url}?order_code=${order_code}`;
        const customerStatusUrl = `${import.meta.env.VITE_APP_URL}${customerStatusPath}`;

        const generateQrCodeUrl = await generateQrCodeFromString(customerStatusUrl);
        const imageCommand = await convertImageToEscPosSharp(generateQrCodeUrl, 200);

        try {
            setPrintStatus('printing');
            await dev.transferOut(endpoint, resetCmd);

            // TEXT
            await dev.transferOut(endpoint, data);

            // QR CODE
            await dev.transferOut(endpoint, EscPosStyling.align.center);
            await dev.transferOut(endpoint, imageCommand);
            await dev.transferOut(endpoint, EscPosStyling.align.left);

            await dev.transferOut(endpoint, cutCmd);

            const totalBytes = data.length + imageCommand.length;
            await new Promise((resolve) => setTimeout(resolve, calculatePrintDelay(totalBytes)));
        } finally {
            setPrintStatus('idle');
        }
    }

    // ── Disconnect ─────────────────────────────────────────────────────────────
    async function disconnect(): Promise<void> {
        const dev = deviceRef.current;

        if (!dev) {
            return;
        }

        try {
            if (dev.opened) {
                await dev.close();
            }

            if ('forget' in dev) {
                await (dev as USBDevice & { forget: () => Promise<void> }).forget();
            }
        } catch (error) {
            console.error('Gagal disconnect:', error);
        }

        deviceRef.current = null;
        endpointRef.current = null;

        setDevice(null);
        setStatus('idle');
        setErrorMessage(null);

        localStorage.removeItem('usb_autoconnect');
    }

    return {
        device,
        status,
        printStatus,
        isConnected: status === 'connected',
        errorMessage,
        connect,
        print,
        disconnect,
    };
}
