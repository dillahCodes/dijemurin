import QRCode from 'qrcode';

export async function generateQrCodeFromString(text: string) {
    try {
        const dataUrl = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'low',
            margin: 1,
            rendererOpts: { quality: 1 },
            width: 200,
            color: { dark: '#000000', light: '#FFFFFF' },
        });

        return dataUrl;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat QR Code');
    }
}
