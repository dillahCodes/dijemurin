import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { useModal } from '@/components/ui/modal';
import type { CartItemType, PaymentMethod } from '@/context/feature/cart/cart-context';
import { useCart } from '@/context/feature/cart/cart-context';
import { checkoutSchema } from '@/schema/feature/cart/checkout-schema';
import order from '@/routes/order';

type CheckoutPayload = {
    outlet_id: number | null;
    cart_items: Array<{ id: number; qty: number }>;
    customer_name: string;
    payment_method: Exclude<PaymentMethod, null>;
    payment_amount: number;
};

function getSimplifiedCartItems(items: CartItemType[]): CheckoutPayload['cart_items'] {
    return items.map(({ data: { id }, qty }) => ({ id, qty }));
}

function calculateTotalPayment(items: CartItemType[]) {
    return items.reduce((total, { qty, data: { price } }) => total + qty * price, 0);
}

function calculateChange(paymentAmount: number, totalPayment: number) {
    return paymentAmount - totalPayment;
}

function parsePaymentAmount(value: string) {
    return Number(value.replace(/\D/g, ''));
}

type ValidateCheckoutPayload = {
    customerName: string;
    paymentMethod: PaymentMethod;
    paymentAmount: number;
    totalPayment: number;
    itemsLength: number;
};

function validateCheckout(params: ValidateCheckoutPayload) {
    return checkoutSchema.safeParse({
        customerName: params.customerName,
        paymentMethod: params.paymentMethod,
        paymentAmount: params.paymentAmount,
        totalBayar: params.totalPayment,
        itemsLength: params.itemsLength,
    });
}

function getCheckoutErrors(validationResult: ReturnType<typeof validateCheckout>) {
    return validationResult.success ? null : validationResult.error.flatten().fieldErrors;
}

function isValidPaymentMethod(paymentMethod: PaymentMethod): paymentMethod is Exclude<PaymentMethod, null> {
    return paymentMethod !== null;
}

type CreateCheckoutPayloadParams = {
    items: CartItemType[];
    customerName: string;
    paymentMethod: Exclude<PaymentMethod, null>;
    paymentAmount: number;
    outletId: number | null;
};

function createCheckoutPayload(params: CreateCheckoutPayloadParams): CheckoutPayload {
    return {
        cart_items: getSimplifiedCartItems(params.items),
        customer_name: params.customerName,
        payment_method: params.paymentMethod,
        payment_amount: params.paymentAmount,
        outlet_id: params.outletId,
    };
}

function getConfirmationDescription(paymentMethod: PaymentMethod) {
    return paymentMethod === 'cash'
        ? 'Pastikan nominal pembayaran dan kembalian pelanggan sudah sesuai.'
        : 'Pastikan dana pembayaran pelanggan telah berhasil masuk ke rekening QRIS.';
}

function showSuccessToast() {
    toast.success('Pesanan berhasil ditambahkan', { position: 'top-center' });
}

function showErrorToast(errors?: Record<string, string>) {
    const firstMessage = errors ? Object.values(errors)[0] : undefined;
    toast.error(firstMessage ?? 'Gagal menambahkan pesanan', { position: 'top-center' });
}

export function useCartStepTwo(onCancel: () => void) {
    const { state, dispatch } = useCart();
    const modal = useModal();

    const {
        customer_name: customerName,
        service_items: items,
        payment_method: paymentMethod,
        payment_amount: paymentAmount,
        outlet_id: outletId,
    } = state;

    const totalBayar = calculateTotalPayment(items);
    const kembalian = calculateChange(paymentAmount, totalBayar);

    const formValidation = validateCheckout({
        customerName,
        paymentMethod,
        paymentAmount,
        totalPayment: totalBayar,
        itemsLength: items.length,
    });

    const disabledSubmitButton = !formValidation.success;
    const errors = getCheckoutErrors(formValidation);

    const handleSuccessSubmit = () => {
        dispatch({ type: 'CLEAR' });
        onCancel();
        showSuccessToast();
    };

    const handleConfirmSubmit = () => {
        if (!isValidPaymentMethod(paymentMethod)) {
            showErrorToast();

            return;
        }

        const payload = createCheckoutPayload({
            items,
            customerName,
            paymentMethod,
            paymentAmount,
            outletId,
        });

        router.post(order.store().url, payload, {
            onSuccess: handleSuccessSubmit,
            onError: (errors) => showErrorToast(errors),
        });
    };

    const openConfirmationModal = () => {
        modal.open({
            id: 'modal-confirm-checkout',
            title: 'Konfirmasi Pesanan',
            description: getConfirmationDescription(paymentMethod),
            withCancelButton: true,
            withConfirmButton: true,
            cancelContent: 'Batal',
            confirmContent: 'Konfirmasi',
            onConfirm: handleConfirmSubmit,
        });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        openConfirmationModal();
    };

    const handleBack = () => {
        dispatch({ type: 'SET_CHECKOUT_STEP', payload: 1 });
    };

    const setCustomerName = (value: string) => {
        dispatch({ type: 'SET_CUSTOMER_NAME', payload: value });
    };

    const setPaymentMethod = (value: PaymentMethod) => {
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: value });
    };

    const setPaymentAmount = (value: string) => {
        dispatch({ type: 'SET_PAYMENT_AMOUNT', payload: parsePaymentAmount(value) });
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
