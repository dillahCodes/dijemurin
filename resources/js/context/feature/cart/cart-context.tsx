import { createContext, useContext, useReducer } from 'react';
import type { ServiceItem } from '@/types/feature/layanan';
import { insertItem, removeItem, updateQty } from './cart-helper';

export interface CartItemType {
    qty: number;
    data: ServiceItem;
}

export type PaymentMethod = 'cash' | 'qris' | null;

export interface CartStateType {
    outlet_id: number | null;
    checkout_step: 1 | 2;
    customer_name: string;
    service_items: CartItemType[];
    payment_method: PaymentMethod;
    payment_amount: number;
}

const initialState: CartStateType = {
    outlet_id: null,
    checkout_step: 1,
    customer_name: '',
    service_items: [],
    payment_method: null,
    payment_amount: 0,
};

interface CartContextValue {
    state: CartStateType;
    dispatch: React.Dispatch<CartAction>;
}

type CartAction =
    | { type: 'SET_OUTLET_ID'; payload: number | null }
    | { type: 'SET_CHECKOUT_STEP'; payload: 1 | 2 }
    | { type: 'SET_ITEM'; payload: CartItemType }
    | { type: 'REMOVE_SERVICE_ITEM'; payload: { id: number } }
    | { type: 'SET_QTY'; payload: { id: number; qty: number } }
    | { type: 'SET_ITEMS'; payload: CartItemType[] }
    | { type: 'SET_CUSTOMER_NAME'; payload: string }
    | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
    | { type: 'SET_PAYMENT_AMOUNT'; payload: number }
    | { type: 'CLEAR' };

function cartReducer(state: CartStateType, action: CartAction): CartStateType {
    let newState: CartStateType;

    switch (action.type) {
        case 'SET_OUTLET_ID':
            newState = { ...state, outlet_id: action.payload };
            break;

        case 'SET_CHECKOUT_STEP':
            newState = { ...state, checkout_step: action.payload };
            break;

        case 'SET_ITEM':
            newState = { ...state, service_items: insertItem(state, action.payload) };
            break;

        case 'SET_QTY':
            newState = { ...state, service_items: updateQty(state, action.payload) };
            break;

        case 'SET_ITEMS':
            newState = { ...state, service_items: action.payload };
            break;

        case 'REMOVE_SERVICE_ITEM':
            newState = { ...state, service_items: removeItem(state, action.payload) };
            break;

        case 'SET_CUSTOMER_NAME':
            newState = { ...state, customer_name: action.payload };
            break;

        case 'SET_PAYMENT_METHOD':
            newState = { ...state, payment_method: action.payload };

            if (action.payload === 'qris') {
                newState.payment_amount = 0;
            }

            break;

        case 'SET_PAYMENT_AMOUNT':
            newState = { ...state, payment_amount: action.payload };
            break;

        case 'CLEAR':
            localStorage.removeItem('cartFeatureContext');

            return initialState;

        default:
            return state;
    }

    localStorage.setItem('cartFeatureContext', JSON.stringify(newState));

    return newState;
}

function getInitialStateLocalStorage() {
    if (typeof window === 'undefined') {
        return initialState;
    }

    const savedState = localStorage.getItem('cartFeatureContext');

    return savedState ? { ...initialState, ...JSON.parse(savedState) } : initialState;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState, getInitialStateLocalStorage);

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}
