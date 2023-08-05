/* -------------------------------------------------------------------------- */
/*                                useIsFunction                               */
/* -------------------------------------------------------------------------- */

export function useIsFunction<T extends (...args: any[]) => any>(
  thing: any
): thing is T {
  return typeof thing === 'function'
}
