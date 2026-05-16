import { useForm } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import outlet from '@/routes/outlet';
import { addOutletSchema } from '@/schema/feature/outlet/add-outlet-schema';
import type { AddOutletSchema } from '@/schema/feature/outlet/add-outlet-schema';

const initialState: AddOutletSchema = {
    name: '',
    address: '',
    email: '',
    phone: '',
    picture: null,
};

export function useOutletTambah() {
    const { data, setData, errors, clearErrors, setError, post, reset } = useForm<AddOutletSchema>(initialState);
    const [picturePreview, setPicturePreview] = useState<string | null>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = addOutletSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        post(outlet.store().url, {
            onSuccess: () => {
                toast.success('Outlet berhasil ditambahkan');
                reset();
            },

            onError: () => {
                toast.error('Outlet gagal ditambahkan');
            },

            preserveScroll: true,
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
        handleSubmit,
    };
}
