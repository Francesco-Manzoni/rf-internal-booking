import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const debounce = <T extends (...args: Array<any>) => void>(
  callback: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: any = null
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}
