import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useDrawer } from '@/components/ui/drawer';
import { useModal } from '@/components/ui/modal';
import { useIsMobile } from '@/hooks/use-mobile';
import layanan from '@/routes/layanan';
import type { Service } from '@/types/feature/layanan';

export function useServiceActions({ id, name }: Service) {
    const isMobile = useIsMobile();
    const modal = useModal();
    const drawer = useDrawer();

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.get(layanan.edit({ id }).url);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDeleteModal();
    };

    const openDeleteModal = () => {
        modal.open({
            id: 'modal-confirm-delete-service',
            title: 'Hapus Layanan',
            content: <div className="line-clamp-2">Apakah anda yakin ingin menghapus layanan {name}?</div>,
            onConfirm: handleConfirmDelete,
            cancelContent: 'Batal',
            confirmContent: 'Hapus',
        });
    };

    const handleConfirmDelete = () => {
        return new Promise<void>((resolve) => {
            router.delete(layanan.destroy({ id }).url, {
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
                onFinish: () => resolve(),
            });
        });
    };

    return { handleEdit, handleDelete };
}
