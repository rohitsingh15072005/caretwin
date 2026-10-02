"use client";

import { useMemo } from "react";
import { usePersistentState, useHydrated, useNow } from "./store";
import {
  SEED_ACCOUNT,
  SEED_MEMBERS,
  SEED_PREFS,
  SEED_RECORDS,
  SELF_ID,
} from "./data";
import type { Account, MedicalRecord, Member, Prefs } from "./types";

export const ALL_ID = "all";

/** Single entry point for everything the dashboard stores locally. */
export function useCareData() {
  const hydrated = useHydrated();
  const now = useNow();
  const [members, setMembers] = usePersistentState<Member[]>("ct:members", SEED_MEMBERS);
  const [records, setRecords] = usePersistentState<MedicalRecord[]>("ct:records", SEED_RECORDS);
  const [activeId, setActiveId] = usePersistentState<string>("ct:active", ALL_ID);
  const [account, setAccount] = usePersistentState<Account>("ct:account", SEED_ACCOUNT);
  const [prefs, setPrefs] = usePersistentState<Prefs>("ct:prefs", SEED_PREFS);

  const self = useMemo(
    () => members.find((m) => m.id === SELF_ID) ?? members[0],
    [members],
  );

  // If the active member was deleted, fall back to everyone.
  const safeActiveId =
    activeId === ALL_ID || members.some((m) => m.id === activeId) ? activeId : ALL_ID;

  const memberById = useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  const scopedRecords = useMemo(
    () =>
      safeActiveId === ALL_ID
        ? records
        : records.filter((r) => r.memberId === safeActiveId),
    [records, safeActiveId],
  );

  return {
    hydrated,
    now,
    members,
    setMembers,
    records,
    setRecords,
    scopedRecords,
    activeId: safeActiveId,
    setActiveId,
    account,
    setAccount,
    prefs,
    setPrefs,
    self,
    memberById,
  };
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
