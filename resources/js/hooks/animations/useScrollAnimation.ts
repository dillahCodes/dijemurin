import { useEffect, useRef, useState, useCallback } from 'react';

export type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in';

export interface ScrollAnimationOptions {
    type?: AnimationType;
    duration?: number;
    delay?: number;
    easing?: string;
    offset?: number;
    once?: boolean;
    threshold?: number;
    disabled?: boolean;
}

const getInitialTransform = (type: AnimationType, offset: number): string => {
    switch (type) {
        case 'fade-up':
            return `translate3d(0, ${offset}px, 0) scale3d(1, 1, 1)`;
        case 'fade-down':
            return `translate3d(0, -${offset}px, 0) scale3d(1, 1, 1)`;
        case 'fade-right':
            return `translate3d(-${offset}px, 0, 0) scale3d(1, 1, 1)`;
        case 'fade-left':
            return `translate3d(${offset}px, 0, 0) scale3d(1, 1, 1)`;
        case 'zoom-in':
            return `translate3d(0, 0, 0) scale3d(0.85, 0.85, 1)`;
        default:
            return `translate3d(0, ${offset}px, 0) scale3d(1, 1, 1)`;
    }
};

const setElementStyles = (element: HTMLElement, opacity: string, transform: string, transition?: string) => {
    element.style.opacity = opacity;
    element.style.transform = transform;

    if (transition !== undefined) {
        element.style.transition = transition;
    }
};

const VISIBLE_TRANSFORM = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(options: ScrollAnimationOptions = {}) {
    const {
        type = 'fade-up',
        duration = 800,
        delay = 0,
        easing = 'ease-out',
        offset = 100,
        once = true,
        threshold = 0.1,
        disabled = false,
    } = options;

    const ref = useRef<T>(null);
    const [, setIsVisible] = useState(false);
    const hasAnimated = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyStyles = useCallback(
        (element: T, visible: boolean) => {
            if (disabled) {
                setElementStyles(element, '1', VISIBLE_TRANSFORM, 'none');

                return;
            }

            if (visible) {
                setElementStyles(element, '1', VISIBLE_TRANSFORM);

                return;
            }

            setElementStyles(element, '0', getInitialTransform(type, offset));
        },
        [type, offset, disabled],
    );

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        if (disabled) {
            applyStyles(element, true);

            return;
        }

        setElementStyles(element, '0', getInitialTransform(type, offset), 'none');

        element.offsetHeight;

        element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    if (once) {
                        return;
                    }

                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }

                    setIsVisible(false);
                    applyStyles(element, false);

                    return;
                }

                if (once && hasAnimated.current) {
                    return;
                }

                hasAnimated.current = true;

                const triggerAnimation = () => {
                    setIsVisible(true);
                    applyStyles(element, true);
                };

                if (delay > 0) {
                    timeoutRef.current = setTimeout(triggerAnimation, delay);
                } else {
                    triggerAnimation();
                }

                if (once) {
                    observer.unobserve(element);
                }
            },

            { threshold },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [type, duration, delay, easing, offset, threshold, once, disabled, applyStyles]);

    return ref;
}
