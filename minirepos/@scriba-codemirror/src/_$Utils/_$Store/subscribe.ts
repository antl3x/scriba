import { useNoop } from '_$Utils/[ use ] useNoop';

/* ------------------------------ subscribe ------------------------------ */
export function subscribe(
  store: any,
  ...callbacks: ((...args: any[]) => any)[]
) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(undefined);
    }
    return useNoop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
