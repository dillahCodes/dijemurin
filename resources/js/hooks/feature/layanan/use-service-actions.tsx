import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ServiceEdit } from '@/components/feature/layanan/service-edit';
import { useDrawer } from '@/components/ui/drawer';
import { useModal } from '@/components/ui/modal';
import { useIsMobile } from '@/hooks/use-mobile';
import layanan from '@/routes/layanan';

export interface ServiceCardProps {
    id: number;
    title: string;
    description: string;
}

const apiServiceDelete = (id: number, options: any) => {
    router.delete(layanan.destroy({ id }).url, options);
};

export function useServiceActions({ id, title, description }: ServiceCardProps) {
    const isMobile = useIsMobile();
    const modal = useModal();
    const drawer = useDrawer();

    const handleNavigate = () => router.visit(`/layanan/${id}`);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();

        modal.open({
            id: 'modal-edit-service',
            title: 'Edit Layanan',
            description: 'Isi form untuk mengedit layanan.',
            withCancelButton: false,
            withConfirmButton: false,
            content: <ServiceEdit serviceId={id} description={description} title={title} />,
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        modal.open({
            id: 'modal-confirm-delete-service',
            title: `Hapus Layanan`,
            content: <div className="line-clamp-2">Apakah anda yakin ingin menghapus layanan {title}?</div>,
            onConfirm: () =>
                new Promise((resolve) => {
                    apiServiceDelete(id, {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Layanan berhasil dihapus', {
                                position: 'top-center',
                            });

                            if (isMobile) {
                                drawer.close('service-drawer');
                            }
                        },
                        onError: () => {
                            toast.error('Layanan gagal dihapus', {
                                position: 'top-center',
                            });

                            if (isMobile) {
                                drawer.close('service-drawer');
                            }
                        },
                        onFinish: () => resolve(undefined),
                    });
                }),
            cancelContent: 'Batal',
            confirmContent: 'Hapus',
        });
    };

    return { handleNavigate, handleEdit, handleDelete };
}
