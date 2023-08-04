/* -------------------------------------------------------------------------- */
/*                               useSafeNotEqual                              */
/* -------------------------------------------------------------------------- */

export function useSafeNotEqual(a: any, b: any) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
