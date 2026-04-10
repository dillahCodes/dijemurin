import { pdf } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LaporanCardProps {
    title: string;
    description: string;
    filename: string;
    /** A @react-pdf/renderer <Document> element */
    document: ReactElement<DocumentProps>;
}

export function LaporanCard({ title, description, filename, document }: LaporanCardProps) {
    const [loading, setLoading] = useState(false);

    async function handleDownload() {
        setLoading(true);

        try {
            const blob = await pdf(document).toBlob();
            const url = URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={handleDownload} disabled={loading} className="w-full cursor-pointer gap-2 sm:w-auto">
                    {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
                    {loading ? 'Menyiapkan...' : 'Download PDF'}
                </Button>
            </CardFooter>
        </Card>
    );
}
