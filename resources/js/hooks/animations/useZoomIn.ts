import { useScrollAnimation, ScrollAnimationOptions } from "./useScrollAnimation";

type ZoomInOptions = Omit<ScrollAnimationOptions, "type">;

export function useZoomIn<T extends HTMLElement = HTMLDivElement>(options: ZoomInOptions = {}) {
  return useScrollAnimation<T>({ ...options, type: "zoom-in" });
}
