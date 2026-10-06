export { useCareData } from "./CareDataProvider";

export const ALL_ID = "all";

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
