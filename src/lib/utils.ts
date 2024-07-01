import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}
