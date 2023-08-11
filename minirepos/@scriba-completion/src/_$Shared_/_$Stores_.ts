import { useIsFunction, useNoop, useSafeNotEqual } from './_$Utils_'

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

/* -------------------------------------------------------------------------- */
/*                                 useDerived                                 */
/* -------------------------------------------------------------------------- */

export function useDerived<T>(
  stores: Stores,
  fn: StoresValues<Stores>,
  initValue: T
) {
  const single = !Array.isArray(stores)
  const stores_array: Array<Readable<any>> = single ? [stores] : stores

  if (!stores_array.every(Boolean)) {
    throw new Error('derived() expects stores as input, got a falsy value')
  }
  const auto = fn.length < 2

  return useReadable(initValue, (set, update) => {
    let started = false
    const values: any[] = []
    let pending = 0
    let cleanup = useNoop
    const sync = () => {
      if (pending) {
        return
      }
      cleanup()
      const result = fn(single ? values[0] : values, set, update)
      if (auto) {
        set(result)
      } else {
        cleanup = useIsFunction(result) ? result : useNoop
      }
    }
    const unsubscribers = stores_array.map((store, i) =>
      subscribe(
        store,
        value => {
          values[i] = value
          pending &= ~(1 << i)
          if (started) {
            sync()
          }
        },
        () => {
          pending |= 1 << i
        }
      )
    )
    started = true
    sync()
    return function stop() {
      // run all cleanups:
      unsubscribers.forEach(u => u())
      cleanup()
      // We need to set this to false because callbacks can still happen despite having unsubscribed:
      // Callbacks might already be placed in the queue which doesn't know it should no longer
      // invoke this derived store.
      started = false
    }
  })
}

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

/* -------------------------------------------------------------------------- */
/*                                  subscribe                                 */
/* -------------------------------------------------------------------------- */
function subscribe(store: any, ...callbacks: ((...args: any[]) => any)[]) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(undefined)
    }
    return useNoop
  }
  const unsub = store.subscribe(...callbacks)
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub
}

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

/** Cleanup logic callback. */
export type Invalidator<T> = (value?: T) => void

/** Pair of subscriber and invalidator. */
export type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>]

/** One or more `Readable`s. */
export type Stores =
  | Readable<any>
  | [Readable<any>, ...Array<Readable<any>>]
  | Array<Readable<any>>

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends Readable<infer U>
  ? U
  : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never }

/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void

/** Unsubscribes from value updates. */
export type Unsubscriber = () => void

/** Callback to update a value. */
export type Updater<T> = (value: T) => T

/**
 * Start and stop notification callbacks.
 * This function is called when the first subscriber subscribes.
 *
 * @param {(value: T) => void} set Function that sets the value of the store.
 * @param {(value: Updater<T>) => void} update Function that sets the value of the store after passing the current value to the update function.
 * @returns {void | (() => void)} Optionally, a cleanup function that is called when the last remaining
 * subscriber unsubscribes.
 */
export type StartStopNotifier<T> = (
  set: (value: T) => void,
  update: (fn: Updater<T>) => void
) => void | (() => void)

/** Readable interface for subscribing. */
export interface Readable<T> {
  /**
   * Subscribe on value changes.
   * @param run subscription callback
   * @param invalidate cleanup callback
   */
  subscribe(
    this: void,
    run: Subscriber<T>,
    invalidate?: Invalidator<T>
  ): Unsubscriber
}

/** Writable interface for both updating and subscribing. */
export interface Writable<T> extends Readable<T> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void

  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: Updater<T>): void
}
