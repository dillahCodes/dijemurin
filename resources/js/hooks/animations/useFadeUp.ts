import { useScrollAnimation, ScrollAnimationOptions } from "./useScrollAnimation";

type FadeUpOptions = Omit<ScrollAnimationOptions, "type">;

export function useFadeUp<T extends HTMLElement = HTMLDivElement>(options: FadeUpOptions = {}) {
  return useScrollAnimation<T>({ ...options, type: "fade-up" });
}
