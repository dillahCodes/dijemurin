import { createContext, useContext, useReducer } from 'react';
import type { ServiceItem } from '@/types/feature/layanan';

interface ServiceItemsType {
    qty: number;
    data: ServiceItem;
}

interface SelectedOrderServiceItemsStateType {
    costumer_name: string;
    service_items: ServiceItemsType[];
}

const initialState: SelectedOrderServiceItemsStateType = {
    costumer_name: '',
    service_items: [],
};

// reducer action
interface SelectedOrderServiceItemsContextValue {
    state: SelectedOrderServiceItemsStateType;
    dispatch: React.Dispatch<SelectedOrderServiceItemsAction>;
}

type SelectedOrderServiceItemsAction = { type: 'SET_DATA'; payload: SelectedOrderServiceItemsStateType } | { type: 'CLEAR' };

function selectedOrderServiceItemsReducer(
    state: SelectedOrderServiceItemsStateType,
    action: SelectedOrderServiceItemsAction,
): SelectedOrderServiceItemsStateType {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload };
        case 'CLEAR':
            return initialState;
        default:
            return state;
    }
}

// context
const SelectedOrderServiceItemsContext = createContext<SelectedOrderServiceItemsContextValue | null>(null);

export function SelectedOrderServiceItemsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(selectedOrderServiceItemsReducer, initialState);

    return (
        <SelectedOrderServiceItemsContext.Provider value={{ state, dispatch }}>
            {children}
        </SelectedOrderServiceItemsContext.Provider>
    );
}

// hook
export function useSelectedOrderServiceItems() {
    const context = useContext(SelectedOrderServiceItemsContext);

    if (!context) {
        throw new Error('useSelectedOrderServiceItems must be used within a SelectedOrderServiceItemsProvider');
    }

    return context;
}
