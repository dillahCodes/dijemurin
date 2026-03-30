import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ServiceItemsEdit } from '@/components/feature/layanan/service-items-edit';
import { useDrawer } from '@/components/ui/drawer';
import { useModal } from '@/components/ui/modal';
import { formatPrice } from '@/helper/formatted-price';
import { useIsMobile } from '@/hooks/use-mobile';
import layanan from '@/routes/layanan';
import type { ServiceItem } from '@/types/feature/layanan';

export type ServiceItemCardProps = ServiceItem;

const apiServiceItemDelete = (service_id: number, id: number, options: any) => {
    router.delete(layanan.items.destroy([service_id, id]).url, options);
};

export function useServiceItemActions(props: ServiceItemCardProps) {
    const { id, service_id, name, price, description, time, unit } = props;
    const defaultData = { name, description, time, price, unit };

    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const modal = useModal();
    const formattedPrice = formatPrice(price);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();

        modal.open({
            id: 'modal-edit-service-item',
            title: 'Edit Price List',
            description: 'Isi form untuk mengedit price list.',
            withCancelButton: false,
            withConfirmButton: false,
            content: <ServiceItemsEdit service_id={service_id} service_item_id={id} defaultData={defaultData} />,
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        modal.open({
            id: 'modal-confirm-delete-service-item',
            title: `Hapus Price List`,
            content: <div className="line-clamp-2">Apakah anda yakin ingin menghapus Price List {name}?</div>,
            onConfirm: () =>
                new Promise((resolve) => {
                    apiServiceItemDelete(service_id, id, {
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
                        onFinish: () => resolve(undefined),
                    });
                }),
            cancelContent: 'Batal',
            confirmContent: 'Hapus',
        });
    };

    return { formattedPrice, handleEdit, handleDelete };
}
