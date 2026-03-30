import { CartItemType, CartStateType } from './cart-context';

export const itemHasExsist = (state: CartStateType, payload: CartItemType) => {
    const service_items = state.service_items || [];

    return service_items.some((item) => item.data.id === payload.data.id);
};

export const insertItem = (state: CartStateType, payload: CartItemType) => {
    const service_items = state.service_items || [];
    const hasExsist = itemHasExsist(state, payload);

    if (hasExsist) {
        return service_items.map((item) =>
            item.data.id === payload.data.id ? { ...item, qty: item.qty + payload.qty } : item,
        );
    }

    return [...service_items, payload];
};

export const updateQty = (state: CartStateType, payload: { id: number; qty: number }) => {
    const service_items = state.service_items || [];
    const { id, qty } = payload;

    const hasItem = service_items.some((item) => item.data.id === id);

    if (hasItem) {
        return service_items.map((item) => (item.data.id === id ? { ...item, qty } : item));
    }

    return service_items;
};

export const removeItem = (state: CartStateType, payload: { id: number }) => {
    const service_items = state.service_items || [];
    const { id } = payload;

    return service_items.filter((item) => item.data.id !== id);
};
