import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';
import { DrawerProvider } from './components/ui/drawer';
import { ModalProvider } from './components/ui/modal';
import { Toaster } from './components/ui/sonner';
import { CartProvider } from './context/feature/cart/cart-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <CartProvider>
                    <TooltipProvider delayDuration={0}>
                        <ModalProvider>
                            <DrawerProvider>
                                <Toaster />
                                <App {...props} />
                            </DrawerProvider>
                        </ModalProvider>
                    </TooltipProvider>
                </CartProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
