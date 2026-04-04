import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import type { CartItemType } from '@/context/feature/cart/cart-context';
import { useCart } from '@/context/feature/cart/cart-context';
import order from '@/routes/order';
import { checkoutSchema } from '@/schema/feature/cart/checkout-schema';

function changeItemsData(items: CartItemType[]) {
    return items.map((item) => ({ id: item.data.id, qty: item.qty }));
}

export function useCartStepTwo(onCancel: () => void) {
    const { state, dispatch } = useCart();
    const modal = useModal();

    const {
        customer_name: customerName,
        service_items: items,
        payment_method: paymentMethod,
        payment_amount: paymentAmount,
    } = state;

    const simplifiedCartItems = changeItemsData(items);

    const totalBayar = items.reduce((acc, item) => acc + item.qty * item.data.price, 0);
    const kembalian = paymentAmount - totalBayar;

    const formValidation = checkoutSchema.safeParse({
        customerName,
        paymentMethod,
        paymentAmount,
        totalBayar,
        itemsLength: items.length,
    });

    const disabledSubmitButton = !formValidation.success;
    const errors = !formValidation.success ? formValidation.error.flatten().fieldErrors : null;

    const handleConfirmSubmit = () => {
        const payload = {
            cart_items: simplifiedCartItems,
            customer_name: customerName,
            payment_method: paymentMethod,
            payment_amount: paymentAmount,
        };

        router.post(order.store().url, payload, {
            onSuccess: () => {
                dispatch({ type: 'CLEAR' });
                onCancel();
                toast.success('Pesanan berhasil ditambahkan', {
                    position: 'top-center',
                });
            },
            onError: () => {
                toast.error('Gagal menambahkan pesanan', {
                    position: 'top-center',
                });
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        modal.open({
            id: 'modal-confirm-checkout',
            title: 'Konfirmasi Pesanan',
            description:
                paymentMethod === 'cash'
                    ? 'Pastikan nominal pembayaran dan kembalian pelanggan sudah sesuai.'
                    : 'Pastikan dana pembayaran pelanggan telah berhasil masuk ke rekening QRIS.',
            withCancelButton: true,
            withConfirmButton: true,
            cancelContent: 'Batal',
            confirmContent: 'Konfirmasi',
            onConfirm: handleConfirmSubmit,
        });
    };

    const handleBack = () => {
        dispatch({ type: 'SET_CHECKOUT_STEP', payload: 1 });
    };

    const setCustomerName = (val: string) => dispatch({ type: 'SET_CUSTOMER_NAME', payload: val });
    const setPaymentMethod = (val: 'cash' | 'qris') => dispatch({ type: 'SET_PAYMENT_METHOD', payload: val });
    const setPaymentAmount = (val: string) => {
        const numericValue = val.replace(/\D/g, '');
        dispatch({ type: 'SET_PAYMENT_AMOUNT', payload: Number(numericValue) });
    };

    return {
        customerName,
        paymentMethod,
        paymentAmount,
        totalBayar,
        kembalian,
        disabledSubmitButton,
        errors,
        items,
        handleSubmit,
        handleBack,
        setCustomerName,
        setPaymentMethod,
        setPaymentAmount,
    };
}
