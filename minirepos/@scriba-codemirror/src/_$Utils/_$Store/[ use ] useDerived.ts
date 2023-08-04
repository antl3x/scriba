import * as _$Utils from '_$Utils';

import { useReadable } from './[ use ] useReadable';
import { subscribe } from './subscribe';
import { Readable, Stores, StoresValues } from './Types';

/* ------------------------------- useDerived ------------------------------ */

export function useDerived<T>(
  stores: Stores,
  fn: StoresValues<Stores>,
  initValue: T
) {
  const single = !Array.isArray(stores);
  const stores_array: Array<Readable<any>> = single ? [stores] : stores;

  if (!stores_array.every(Boolean)) {
    throw new Error('derived() expects stores as input, got a falsy value');
  }
  const auto = fn.length < 2;

  return useReadable(initValue, (set, update) => {
    let started = false;
    const values: any[] = [];
    let pending = 0;
    let cleanup = _$Utils.useNoop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update);
      if (auto) {
        set(result);
      } else {
        cleanup = _$Utils.useIsFunction(result) ? result : _$Utils.useNoop;
      }
    };
    const unsubscribers = stores_array.map((store, i) =>
      subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      // run all cleanups:
      unsubscribers.forEach((u) => u());
      cleanup();
      // We need to set this to false because callbacks can still happen despite having unsubscribed:
      // Callbacks might already be placed in the queue which doesn't know it should no longer
      // invoke this derived store.
      started = false;
    };
  });
}
