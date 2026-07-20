import { useState } from 'react';

export function useMobileNav() {
    const [open, setOpen] = useState(false);

    const closeNav = () => setOpen(false);

    return {
        open,
        setOpen,
        closeNav,
    };
}
