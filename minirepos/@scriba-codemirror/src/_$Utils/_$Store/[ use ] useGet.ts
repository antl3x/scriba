import { subscribe } from './subscribe'
import { Readable } from './Types'

/* -------------------------------------------------------------------------- */
/*                                   useGet                                   */
/* -------------------------------------------------------------------------- */
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 */
export function useGet<T>(store: Readable<T>): T {
  let value: T | undefined
  subscribe(store, _ => (value = _))()
  return value as T
}
