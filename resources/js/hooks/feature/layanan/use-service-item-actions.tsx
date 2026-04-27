import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useDrawer } from '@/components/ui/drawer';
import { useModal } from '@/components/ui/modal';
import { formatPrice } from '@/helper/formatted-price';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ServiceItem } from '@/types/feature/layanan';
import layanan from '@/routes/layanan';

export function useServiceItemActions(props: ServiceItem) {
    const { id, service_id, name, price } = props;

    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const modal = useModal();
    const formattedPrice = formatPrice(price);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.get(layanan.items.edit([service_id, id]).url);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDeleteModal();
    };

    const openDeleteModal = () => {
        modal.open({
            id: 'modal-confirm-delete-service-item',
            title: 'Hapus Price List',
            content: <div className="line-clamp-2">Apakah anda yakin ingin menghapus Price List {name}?</div>,
            onConfirm: handleConfirmDelete,
            cancelContent: 'Batal',
            confirmContent: 'Hapus',
        });
    };

    const handleConfirmDelete = () => {
        return new Promise<void>((resolve) => {
            router.delete(layanan.items.destroy([service_id, id]).url, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Price List berhasil dihapus', {
                        position: 'top-center',
                    });

                    if (isMobile) {
                        drawer.close('service-item-drawer');
                    }
                },
                onError: () => {
                    toast.error('Price List gagal dihapus', {
                        position: 'top-center',
                    });

                    if (isMobile) {
                        drawer.close('service-item-drawer');
                    }
                },
                onFinish: () => resolve(),
            });
        });
    };

    return { formattedPrice, handleEdit, handleDelete };
}
