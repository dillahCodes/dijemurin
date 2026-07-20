import type React from 'react';

export function useSmoothScroll() {
    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
        targetId: string,
        onComplete?: () => void,
    ) => {
        e.preventDefault();

        const cleanId = targetId.replace('#', '');

        if (!cleanId) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            if (onComplete) {
                onComplete();
            }

            return;
        }

        const element = document.getElementById(cleanId);

        if (element) {
            const headerOffset = 90;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }

        if (onComplete) {
            onComplete();
        }
    };

    return { scrollToSection };
}
