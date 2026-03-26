import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Accepts strings/numbers, arrays of values, and objects like `{ "class": boolean }`.
 *
 * @typedef {string | number | null | undefined | false | ClassValue[] | Record<string, boolean>} ClassValue
 * @param {...ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
