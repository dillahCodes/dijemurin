import { customerStatusOrder } from '@/actions/App/Http/Controllers/Order/OrderController';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface PageFlasError {
    error?: string;
    success?: boolean;
}

export function useOrderChecker() {
    const [orderCode, setOrderCode] = useState('');

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const trimmedCode = orderCode.trim();

        if (trimmedCode) {
            router.get(customerStatusOrder.url({ query: { order_code: trimmedCode } }), undefined, {
                onSuccess: (page) => {
                    const flash = page.props.flash as PageFlasError;
                    if (flash.error) toast.error(flash.error, { position: 'top-center' });
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    if (firstError) toast.error(firstError, { position: 'top-center' });
                },
            });
        }
    };

    return {
        orderCode,
        setOrderCode,
        handleSubmit,
    };
}
