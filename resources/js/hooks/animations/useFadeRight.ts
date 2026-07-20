import type { ScrollAnimationOptions } from './useScrollAnimation';
import { useScrollAnimation } from './useScrollAnimation';

type FadeRightOptions = Omit<ScrollAnimationOptions, 'type'>;

export function useFadeRight<T extends HTMLElement = HTMLDivElement>(options: FadeRightOptions = {}) {
    return useScrollAnimation<T>({ ...options, type: 'fade-right' });
}
