import { Head } from '@inertiajs/react';
import { PrinterSetting } from '@/components/feature/settings/printer';
import Heading from '@/components/ui/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import printer from '@/routes/printer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Printer',
        href: printer.edit(),
    },
];

export default function Printer() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Printer" />

            <h1 className="sr-only">Pengaturan Printer</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading variant="small" title="Pengaturan Printer" description="Atur printer sesuai keinginan" />
                    <PrinterSetting />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
