"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store built on useSyncExternalStore.
 * - Server render + hydration use `initial`, so there are no hydration mismatches.
 * - After hydration the stored value is read, and every tab stays in sync.
 * `initial` MUST be a stable reference (a module-level constant).
 */

const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function emit(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (cb: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(cb);

      const onStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) cb();
      };
      window.addEventListener("storage", onStorage);

      return () => {
        set.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key);
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value as T;

    let value: T = initial;
    if (raw !== null) {
      try {
        value = JSON.parse(raw) as T;
      } catch {
        value = initial;
      }
    }
    cache.set(key, { raw, value });
    return value;
  }, [key, initial]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => initial);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage full or blocked: keep the in-memory value for this session.
        cache.set(key, { raw: JSON.stringify(resolved), value: resolved });
      }
      emit(key);
    },
    [key, getSnapshot],
  );

  return [value, setValue];
}

export function clearAllCareTwinData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("ct:"))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  cache.clear();
}

const noopSubscribe = () => () => {};

/** false during SSR/hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** A stable "now" for the page session (SSR gets a fixed anchor). */
let clientNow: number | null = null;
const SERVER_NOW = Date.UTC(2026, 9, 1);
export function useNow() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (clientNow ??= Date.now()),
    () => SERVER_NOW,
  );
}
