import { useScrollAnimation, ScrollAnimationOptions } from "./useScrollAnimation";

type FadeLeftOptions = Omit<ScrollAnimationOptions, "type">;

export function useFadeLeft<T extends HTMLElement = HTMLDivElement>(options: FadeLeftOptions = {}) {
  return useScrollAnimation<T>({ ...options, type: "fade-left" });
}
