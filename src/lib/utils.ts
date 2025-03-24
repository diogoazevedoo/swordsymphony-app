import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeGet(obj: any, path: string, defaultValue: any = null) {
  try {
    return (
      path
        .split('.')
        .reduce(
          (o, key) =>
            o && o[key] !== undefined && o[key] !== null ? o[key] : null,
          obj,
        ) || defaultValue
    )
  } catch (e) {
    return defaultValue
  }
}
