import { useCart } from '@/context/feature/cart/cart-context';

export function useCartStepOne(onCancel: () => void) {
    const { state, dispatch } = useCart();

    const items = state.service_items;
    const hasItems = items.length > 0;

    const handleNext = () => {
        dispatch({ type: 'SET_CHECKOUT_STEP', payload: 2 });
    };

    return {
        items,
        hasItems,
        handleNext,
        onCancel,
    };
}
