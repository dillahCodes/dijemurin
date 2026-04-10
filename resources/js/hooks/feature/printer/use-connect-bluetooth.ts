import { useEffect, useRef, useState } from 'react';
import { EscPosStyling } from '@/helper/esc-pos-styling';
import { convertImageToEscPosSharp } from '@/helper/image-to-esc-pos';

// ─── Konstanta ─────────────────────────────────────────────────────────────────
// NOTE: download aplikasi "nRF Connect" di HP, lalu cari device bluetooth printer kamu untuk melihat service & characteristic ID nya
// NOTE: pastikan memilih service dengan property "indicate", "notify", "read", dan "write without response"
const SERVICE_ID = 'e7810a71-73ae-499d-8c15-faa9aef0c3f2';
const CHARACTERISTIC_ID = 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f';
const CHUNK_SIZE = 200;

const BASE_PRINT_DELAY_MS = 2000;
const DELAY_MULTIPLIER_PER_BYTE = 0.5;
const MINIMUM_PRINT_DELAY_MS = 3000;
const MAXIMUM_PRINT_DELAY_MS = 15000;

// ─── Types ─────────────────────────────────────────────────────────────────────
export type BluetoothStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface UseConnectBluetoothReturn {
    device: BluetoothDevice | null;
    status: BluetoothStatus;
    printStatus: 'idle' | 'printing';
    isConnected: boolean;
    errorMessage: string | null;
    connect: () => Promise<void>;
    print: (data: Uint8Array) => Promise<void>;
    disconnect: () => Promise<void>;
}

// ─── Helper ────────────────────────────────────────────────────────────────────
async function writeInChunks(
    characteristic: BluetoothRemoteGATTCharacteristic,
    data: Uint8Array,
    chunkSize: number = CHUNK_SIZE,
): Promise<void> {
    const write = characteristic.writeValueWithoutResponse ?? characteristic.writeValue;

    if (!write) {
        throw new Error('Browser tidak mendukung write Bluetooth');
    }

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await write.call(characteristic, chunk);
    }
}

// ─── Helper: simulasi estimasi waktu cetak mekanik ─────────────────────────────
function calculatePrintDelay(totalBytes: number): number {
    const calculatedDelay = BASE_PRINT_DELAY_MS + totalBytes * DELAY_MULTIPLIER_PER_BYTE;

    return Math.min(Math.max(calculatedDelay, MINIMUM_PRINT_DELAY_MS), MAXIMUM_PRINT_DELAY_MS);
}

/**
 * Hook untuk koneksi & komunikasi Bluetooth.
 *
 * @returns device, isConnected, status, connect, print, disconnect
 *
 * @example
 * const { connect, print, disconnect } = useConnectBluetooth();
 * await connect();
 * await print("Hello");
 * await disconnect();
 */
export function useConnectBluetooth(): UseConnectBluetoothReturn {
    const deviceRef = useRef<BluetoothDevice | null>(null);
    const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

    const [device, setDevice] = useState<BluetoothDevice | null>(null);
    const [status, setStatus] = useState<BluetoothStatus>('idle');
    const [printStatus, setPrintStatus] = useState<'idle' | 'printing'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ── Handler disconnect ──────────────────────────────────────────────────────
    function handleDisconnected() {
        deviceRef.current = null;
        characteristicRef.current = null;
        setDevice(null);
        setStatus('idle');
        setErrorMessage(null);
    }

    // ── Auto reconnect ────────────────────────────────────────────────────────────────
    useEffect(() => {
        async function autoReconnect() {
            if (!('bluetooth' in navigator)) {
                return;
            }

            const shouldAutoConnect = localStorage.getItem('bt_autoconnect') === 'true';

            if (!shouldAutoConnect) {
                return;
            }

            try {
                if (typeof navigator.bluetooth.getDevices !== 'function') {
                    return;
                }

                const devices = await navigator.bluetooth.getDevices();

                const existingDevice = devices[0];

                if (!existingDevice) {
                    return;
                }

                setStatus('connecting');

                existingDevice.addEventListener('gattserverdisconnected', handleDisconnected);

                const server = await existingDevice.gatt?.connect();

                if (!server) {
                    return;
                }

                const service = await server.getPrimaryService(SERVICE_ID);
                const characteristic = await service.getCharacteristic(CHARACTERISTIC_ID);

                deviceRef.current = existingDevice;
                characteristicRef.current = characteristic;

                setDevice(existingDevice);
                setStatus('connected');
            } catch (error) {
                console.error('Auto reconnect bluetooth gagal:', error);
            }
        }

        autoReconnect();
    }, []);

    // ── Connect ────────────────────────────────────────────────────────────────
    async function connect(): Promise<void> {
        if (deviceRef.current?.gatt?.connected) {
            return;
        }

        if (!navigator.bluetooth) {
            const msg = 'Web Bluetooth API tidak didukung di browser ini.';
            setErrorMessage(msg);
            setStatus('error');

            return;
        }

        try {
            setStatus('connecting');
            setErrorMessage(null);

            const selectedDevice = await navigator.bluetooth.requestDevice({
                filters: [{ services: [SERVICE_ID] }],
                optionalServices: [SERVICE_ID],
            });

            selectedDevice.addEventListener('gattserverdisconnected', handleDisconnected);

            const server = await selectedDevice.gatt?.connect();

            if (!server) {
                throw new Error('Gagal terhubung ke GATT server.');
            }

            const service = await server.getPrimaryService(SERVICE_ID);
            const characteristic = await service.getCharacteristic(CHARACTERISTIC_ID);

            deviceRef.current = selectedDevice;
            characteristicRef.current = characteristic;
            setDevice(selectedDevice);
            setStatus('connected');

            localStorage.setItem('bt_autoconnect', 'true');
        } catch (error: unknown) {
            console.error('Koneksi Bluetooth gagal:', error);

            if (error instanceof DOMException && error.name === 'NotFoundError') {
                setStatus('idle');

                return;
            }

            const msg = error instanceof Error ? error.message : 'Koneksi Bluetooth gagal.';
            setErrorMessage(msg);
            setStatus('error');

            deviceRef.current = null;
            characteristicRef.current = null;
            setDevice(null);
        }
    }

    // ── Print ──────────────────────────────────────────────────────────────────
    async function print(data: Uint8Array): Promise<void> {
        if (!deviceRef.current?.gatt?.connected) {
            await connect();
        }

        const characteristic = characteristicRef.current;

        if (!characteristic) {
            throw new Error('Karakteristik Bluetooth tidak tersedia.');
        }

        const resetCmd = new Uint8Array([0x1b, 0x40]);
        const cutCmd = new Uint8Array([0x1d, 0x56, 0x42, 0x00]);

        // const invoice = generateInvoice();
        const imageCommand = await convertImageToEscPosSharp('/apple-touch-icon.png', 180);

        try {
            setPrintStatus('printing');
            await writeInChunks(characteristic, resetCmd);

            // TEXT
            await writeInChunks(characteristic, data);

            //  QR CODE
            await writeInChunks(characteristic, EscPosStyling.align.center);
            await writeInChunks(characteristic, imageCommand);
            await writeInChunks(characteristic, EscPosStyling.align.left);

            await writeInChunks(characteristic, cutCmd);

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

        dev.removeEventListener('gattserverdisconnected', handleDisconnected);

        if (dev.gatt?.connected) {
            dev.gatt.disconnect();
        }

        if ('forget' in dev) {
            try {
                await (dev as BluetoothDevice & { forget: () => Promise<void> }).forget();
            } catch {
                // ignore
            }
        }

        deviceRef.current = null;
        characteristicRef.current = null;
        setDevice(null);
        setStatus('idle');
        setErrorMessage(null);

        localStorage.removeItem('bt_autoconnect');
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
