import { createContext, useContext, useReducer } from 'react';

export const ConnectionTypeEnum = {
    BLUETOOTH: 'bluetooth',
    USB: 'usb',
} as const;

export type ConnectionType = (typeof ConnectionTypeEnum)[keyof typeof ConnectionTypeEnum];

export interface InitialState {
    connection_type: ConnectionType;
}

const getInitialConnectionType = (): ConnectionType => {
    const isBtConnected = localStorage.getItem('bt_autoconnect') === 'true';
    const isUsbConnected = localStorage.getItem('usb_autoconnect') === 'true';

    if (isBtConnected && isUsbConnected) {
        return ConnectionTypeEnum.BLUETOOTH;
    }

    if (isUsbConnected) {
        return ConnectionTypeEnum.USB;
    }

    if (isBtConnected) {
        return ConnectionTypeEnum.BLUETOOTH;
    }

    const saved = localStorage.getItem('current_connected') as ConnectionType | null;

    if (saved === ConnectionTypeEnum.USB || saved === ConnectionTypeEnum.BLUETOOTH) {
        return saved;
    }

    return ConnectionTypeEnum.BLUETOOTH;
};

const initialState: InitialState = {
    connection_type: getInitialConnectionType(),
};

interface ConnectionTypeContextValue {
    state: InitialState;
    dispatch: React.Dispatch<ConnectionTypeAction>;
}

type ConnectionTypeAction = { type: 'SET_CONNECTION_TYPE'; payload: ConnectionType };

function connectionTypeReducer(state: InitialState, action: ConnectionTypeAction): InitialState {
    switch (action.type) {
        case 'SET_CONNECTION_TYPE':
            localStorage.setItem('current_connected', action.payload);

            return { ...state, connection_type: action.payload };

        default:
            return state;
    }
}

const ConnectionTypeContext = createContext<ConnectionTypeContextValue | null>(null);

export function ConnectionTypeProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(connectionTypeReducer, initialState);

    return <ConnectionTypeContext.Provider value={{ state, dispatch }}>{children}</ConnectionTypeContext.Provider>;
}

export function useConnectionType() {
    const context = useContext(ConnectionTypeContext);

    if (!context) {
        throw new Error('useConnectionType must be used within a ConnectionTypeProvider');
    }

    return context;
}
