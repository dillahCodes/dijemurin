'use client';

import { createContext, type ReactNode, useContext, useState, useEffect, useCallback } from 'react';

type DrawerPlacement = 'bottom' | 'top' | 'right' | 'left';

export interface DrawerOptions {
    id: string | number;
    content?: ReactNode;
    placement?: DrawerPlacement;
    wrapperClassName?: string;
    onDrawerClose?: () => void;
}

interface DrawerState extends DrawerOptions {
    isClosing: boolean;
}

interface DrawerController {
    open: (options: DrawerOptions) => void;
    close: (id: string | number) => void;
    closeAll: () => void;
}

const DrawerContext = createContext<DrawerController | null>(null);
const DEFAULT_OPTIONS: Partial<DrawerOptions> = { placement: 'bottom' };

interface DrawerInstanceProps {
    drawerItem: DrawerState;
    close: (id: string | number) => void;
    removeDrawer: (id: string | number) => void;
}

export function useDrawer(): DrawerController {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error('useDrawer must be used inside DrawerProvider');
    return ctx;
}

function DrawerInstance({ drawerItem, close, removeDrawer }: DrawerInstanceProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!drawerItem.isClosing) {
            const timer = requestAnimationFrame(() => setIsOpen(true));
            return () => cancelAnimationFrame(timer);
        }

        setIsOpen(false);
        const timer = setTimeout(() => {
            drawerItem.onDrawerClose?.();
            removeDrawer(drawerItem.id);
        }, 300);

        return () => clearTimeout(timer);
    }, [drawerItem, removeDrawer]);

    const placement = drawerItem.placement || 'bottom';

    const getPlacementClasses = () => {
        switch (placement) {
            case 'top':
                return `top-0 left-0 right-0 w-full ${isOpen ? 'translate-y-0' : '-translate-y-full'}`;
            case 'bottom':
                return `bottom-0 left-0 right-0 w-full ${isOpen ? 'translate-y-0' : 'translate-y-full'}`;
            case 'left':
                return `top-0 bottom-0 left-0 h-full overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;
            case 'right':
                return `top-0 bottom-0 right-0 h-full overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;
            default:
                return `bottom-0 left-0 right-0 w-full ${isOpen ? 'translate-y-0' : 'translate-y-full'}`;
        }
    };

    return (
        <section
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/50' : 'pointer-events-none bg-black/0'}`}
            onClick={() => {
                close(drawerItem.id);
                drawerItem.onDrawerClose?.();
            }}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className={`fixed bg-white/95 transition-transform duration-300 ease-out dark:bg-zinc-900 ${getPlacementClasses()} ${drawerItem.wrapperClassName ?? ''}`}
            >
                {drawerItem.content}
            </div>
        </section>
    );
}

export function DrawerProvider({ children }: { children: ReactNode }) {
    const [drawers, setDrawers] = useState<DrawerState[]>([]);

    const open = useCallback((options: DrawerOptions) => {
        setDrawers((prev) => {
            const filtered = prev.filter((item) => item.id !== options.id);
            return [...filtered, { ...DEFAULT_OPTIONS, ...options, isClosing: false }];
        });
        document.body.classList.add('overflow-hidden');
    }, []);

    const close = useCallback((id: string | number) => {
        setDrawers((prev) => prev.map((item) => (item.id === id ? { ...item, isClosing: true } : item)));
    }, []);

    const closeAll = useCallback(() => {
        setDrawers((prev) => prev.map((item) => ({ ...item, isClosing: true })));
    }, []);

    const removeDrawer = useCallback((id: string | number) => {
        setDrawers((prev) => {
            const remaining = prev.filter((item) => item.id !== id);
            if (remaining.length === 0) document.body.classList.remove('overflow-hidden');
            return remaining;
        });
    }, []);

    return (
        <DrawerContext.Provider value={{ open, close, closeAll }}>
            {children}
            {drawers.map((item) => (
                <DrawerInstance key={item.id} drawerItem={item} close={close} removeDrawer={removeDrawer} />
            ))}
        </DrawerContext.Provider>
    );
}
