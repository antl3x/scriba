/* -------------------------------------------------------------------------- */
/*                                 useDebounce                                */
/* -------------------------------------------------------------------------- */
/**
 * @param f callback
 * @param wait milliseconds
 * @param abortValue if has abortValue, promise will reject it if
 * @returns Promise
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  abortValue: any = undefined
) {
  let cancel = () => {
    // do nothing
  }
  // type Awaited<T> = T extends PromiseLike<infer U> ? U : T
  type ReturnT = Awaited<ReturnType<T>>
  const wrapFunc = (...args: Parameters<T>): Promise<ReturnT> => {
    cancel()
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(fn(...args)), wait)
      cancel = () => {
        clearTimeout(timer)
        if (abortValue !== undefined) {
          reject(abortValue)
        }
      }
    })
  }
  return wrapFunc
}

/* -------------------------------------------------------------------------- */
/*                                useIsFunction                               */
/* -------------------------------------------------------------------------- */

export function useIsFunction<T extends (...args: any[]) => any>(
  thing: any
): thing is T {
  return typeof thing === 'function'
}

/* -------------------------------------------------------------------------- */
/*                                   useNoop                                  */
/* -------------------------------------------------------------------------- */
// eslint-disable-next-line
export function useNoop() {}

/* -------------------------------------------------------------------------- */
/*                               useSafeNotEqual                              */
/* -------------------------------------------------------------------------- */

export function useSafeNotEqual(a: any, b: any) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function'
}

/* -------------------------------------------------------------------------- */
/*                            Module Type Checking                            */
/* -------------------------------------------------------------------------- */
// This is a hack to make sure that the module type is correct
/* eslint-disable */

export const satisfies = <ModuleInterface, TypeOfFile extends ModuleInterface>() => {
  void 0 as TypeOfFile
}
