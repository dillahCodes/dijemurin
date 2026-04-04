import { useRef } from 'react';

// --- 1. Fungsi untuk membuat iframe tersembunyi ---
const createHiddenIframe = (): HTMLIFrameElement => {
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
        position: 'absolute',
        width: '0',
        height: '0',
        border: 'none',
    });
    document.body.appendChild(iframe);
    return iframe;
};

// --- 2. Fungsi untuk menyuntikkan konten dan style ---
const setupIframeContent = (iframeDoc: Document, title: string, contentHTML: string) => {
    iframeDoc.title = title;

    // Setup Konten
    const container = iframeDoc.createElement('div');
    container.innerHTML = contentHTML;

    iframeDoc.body.appendChild(container);
};

// --- 3. Fungsi untuk eksekusi print dan hapus iframe ---
const executePrintAndCleanup = (iframe: HTMLIFrameElement, originalTitle: string) => {
    const contentWindow = iframe.contentWindow;
    if (!contentWindow) return;

    // Fungsi helper untuk cleanup agar tidak ada duplikasi kode
    const cleanup = () => {
        if (document.body.contains(iframe)) {
            document.title = originalTitle;
            document.body.removeChild(iframe);
        }
    };

    contentWindow.focus();

    // Event listener untuk browser modern
    contentWindow.addEventListener('afterprint', cleanup, { once: true });
    contentWindow.print();

    // Fallback untuk browser lama atau jika afterprint gagal memicu
    setTimeout(cleanup, 1000);
};

// --- Hook Utama ---
export function usePrintElement<T extends HTMLElement>() {
    const printRef = useRef<T | null>(null);

    const handlePrint = (documentTitle: string) => {
        if (!printRef.current) return;

        const originalTitle = document.title;
        document.title = documentTitle; // Ubah title sementara untuk nama file PDF/Print

        const iframe = createHiddenIframe();
        const iframeDoc = iframe.contentWindow?.document;

        if (iframeDoc) {
            setupIframeContent(iframeDoc, documentTitle, printRef.current.innerHTML);
            executePrintAndCleanup(iframe, originalTitle);
        } else {
            // Fallback error handling jika iframe gagal dirender
            document.title = originalTitle;
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }
    };

    return { printRef, handlePrint };
}
