import { useSafeNotEqual } from '../[ use ] useSafeNotEqual'
import { useNoop } from '../[ use ] useNoop'

import {
  StartStopNotifier,
  SubscribeInvalidateTuple,
  Subscriber,
  Unsubscriber,
  Updater,
  Writable
} from './Types'

/* -------------------------------------------------------------------------- */
/*                                 useWritable                                */
/* -------------------------------------------------------------------------- */
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 */

/* --------------------------- SUBSCRIBER_QUEUE --------------------------- */

export const SUBSCRIBER_QUEUE: (SubscribeInvalidateTuple<any> | any)[] = []

export function useWritable<T>(
  value: T,
  start: StartStopNotifier<T> = useNoop
): Writable<T> {
  let stop: Unsubscriber | null = null
  const subscribers = new Set<SubscribeInvalidateTuple<T>>()

  /* --------------------------------- _fnSet --------------------------------- */

  function _fnSet(new_value: T) {
    if (useSafeNotEqual(value, new_value)) {
      value = new_value
      if (stop) {
        // store is ready
        const __runQueue = !SUBSCRIBER_QUEUE.length
        for (const subscriber of subscribers) {
          subscriber[1]()
          SUBSCRIBER_QUEUE.push(subscriber, value)
        }
        if (__runQueue) {
          for (let i = 0; i < SUBSCRIBER_QUEUE.length; i += 2) {
            SUBSCRIBER_QUEUE[i][0](SUBSCRIBER_QUEUE[i + 1])
          }
          SUBSCRIBER_QUEUE.length = 0
        }
      }
    }
  }

  /* --------------------------------- _fnUpdate --------------------------------- */

  function _fnUpdate(fn: Updater<T>) {
    _fnSet(fn(value))
  }

  /* -------------------------------- _fnSubscribe ------------------------------- */

  function _fnSubscribe(
    run: Subscriber<T>,
    invalidate = useNoop
  ): Unsubscriber {
    const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate]
    subscribers.add(subscriber)
    if (subscribers.size === 1) {
      stop = start(_fnSet, _fnUpdate) || useNoop
    }
    run(value)
    return () => {
      subscribers.delete(subscriber)
      if (subscribers.size === 0 && stop) {
        stop()
        stop = null
      }
    }
  }
  return { set: _fnSet, update: _fnUpdate, subscribe: _fnSubscribe }
}
