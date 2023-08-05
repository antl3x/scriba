import { useWritable } from './[ use ] useWritable'
import { Readable, StartStopNotifier } from './Types'

/* -------------------------------------------------------------------------- */
/*                                 useReadable                                */
/* -------------------------------------------------------------------------- */
/**
 * Creates a `Readable` store that allows reading by subscription.
 */
export function useReadable<T>(
  value: T,
  start: StartStopNotifier<T>
): Readable<T> {
  return {
    subscribe: useWritable(value, start).subscribe
  }
}
