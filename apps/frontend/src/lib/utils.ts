import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine tailwind classed and add conditional classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
