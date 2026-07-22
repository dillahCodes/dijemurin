import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { OutletEditSectionProps } from '@/components/feature/outlet/edit/outlet-edit-section';
import { useModal } from '@/components/ui/modal';
import type { EditOutletSchema } from '@/schema/feature/outlet/edit-outlet-schema';
import { editOutletSchema } from '@/schema/feature/outlet/edit-outlet-schema';
import type { OutletDetail, OutletStatus } from '@/types/feature/outlet/outlet';
import outlet from '@/routes/outlet';

function generateInitialState(outletDetail: OutletDetail): EditOutletSchema {
    return {
        name: outletDetail.name,
        address: outletDetail.address,
        email: outletDetail.email,
        phone: outletDetail.phone,
        status: outletDetail.status.value,
        picture: null,
    };
}

export function useOutletEdit() {
    const modal = useModal();
    const { outletDetail, outletStatusOptions } = usePage<OutletEditSectionProps>().props;
    const initialState = generateInitialState(outletDetail.data);

    const { data, setData, errors, clearErrors, setError, patch, reset } = useForm<EditOutletSchema>(initialState);
    const [picturePreview, setPicturePreview] = useState<string | null>(outletDetail.data.picture || null);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('picture', file);
            clearErrors('picture');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            handleRemovePicture();
        }
    };

    const handleRemovePicture = () => {
        setData('picture', null);
        setPicturePreview(null);
    };

    const handleStatusChange = (value: string) => {
        setData('status', value as OutletStatus['value']);
        clearErrors('status');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = editOutletSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        modal.open({
            id: 'submit-outlet-change',
            title: 'Simpan perubahan',
            description: 'Apakah anda yakin ingin menyimpan perubahan?',
            confirmContent: 'Simpan',
            cancelContent: 'Batal',

            onConfirm() {
                patch(outlet.edit(outletDetail.data.id).url, {
                    onSuccess: () => {
                        toast.success('Outlet berhasil diupdate');
                        reset();
                    },

                    onError: () => {
                        toast.error('Outlet gagal diupdate');
                    },
                    preserveScroll: true,
                });
            },
        });
    };

    return {
        data,
        setData,
        errors,
        clearErrors,
        picturePreview,
        handlePictureChange,
        handleRemovePicture,
        outletStatusOptions,
        handleStatusChange,
        handleSubmit,
    };
}
