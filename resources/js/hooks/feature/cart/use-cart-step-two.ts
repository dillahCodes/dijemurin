import { useCart } from '@/context/feature/cart/cart-context';
import { useModal } from '@/components/ui/modal';

export function useCartStepTwo(onCancel: () => void) {
    const { state, dispatch } = useCart();
    const modal = useModal();

    const {
        customer_name: customerName,
        service_items: items,
        payment_method: paymentMethod,
        payment_amount: paymentAmount,
    } = state;

    const totalBayar = items.reduce((acc, item) => acc + item.qty * item.data.price, 0);
    const kembalian = paymentAmount - totalBayar;

    const disabledSubmitButtonConditions = [
        !items.length,
        !customerName,
        !paymentMethod,
        paymentMethod === 'cash' && paymentAmount < totalBayar,
    ];
    const disabledSubmitButton = disabledSubmitButtonConditions.some((condition) => condition);

    const handleConfirmSubmit = () => {
        console.log('sukses');
        dispatch({ type: 'CLEAR' });
        onCancel();
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
        items,
        handleSubmit,
        handleBack,
        setCustomerName,
        setPaymentMethod,
        setPaymentAmount,
    };
}
