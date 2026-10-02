"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Droplet, HeartPulse, Phone, ShieldAlert, PhoneCall } from "lucide-react";
import { parsePayloadFromHash, type EmergencyPayload } from "@/lib/emergency";
import { SITE } from "@/lib/site";

// The data lives after the # in the URL, so it never reaches a server or logs.
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getHash = () => window.location.hash;

export default function EmergencyViewPage() {
  const hash = useSyncExternalStore(subscribe, getHash, () => "");
  const payload: EmergencyPayload | null = hash ? parsePayloadFromHash(hash) : null;

  return (
    <main className="min-h-dvh bg-navy px-4 py-6 text-white">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2 rounded-t-2xl bg-danger px-5 py-3 text-sm font-bold">
          <ShieldAlert size={18} /> EMERGENCY MEDICAL INFORMATION
        </div>

        <div className="space-y-5 rounded-b-2xl bg-navy-2 p-5">
          {!hash ? (
            <p className="py-8 text-center text-sm text-[#b9c4d8]">Loading…</p>
          ) : !payload ? (
            <div className="py-8 text-center">
              <p className="font-semibold">This code could not be read.</p>
              <p className="mt-1 text-sm text-[#b9c4d8]">The link may be incomplete. Ask the owner to share the card again.</p>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold leading-tight">{payload.n}</h1>
                {payload.g !== undefined && <p className="text-[#b9c4d8]">{payload.g} years old</p>}
              </div>

              <div className="flex flex-wrap gap-3">
                {payload.b && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-3">
                    <Droplet className="text-[#ff7b80]" />
                    <div>
                      <p className="text-xs text-[#b9c4d8]">Blood group</p>
                      <p className="text-2xl font-bold leading-none">{payload.b}</p>
                    </div>
                  </div>
                )}
                {payload.o !== undefined && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-3">
                    <HeartPulse className="text-mint" />
                    <div>
                      <p className="text-xs text-[#b9c4d8]">Organ donor</p>
                      <p className="text-lg font-bold leading-none">{payload.o ? "Yes" : "No"}</p>
                    </div>
                  </div>
                )}
              </div>

              {payload.a?.length ? (
                <div className="rounded-xl border border-[#ff7b80]/50 bg-danger/20 p-4">
                  <p className="text-xs font-bold text-[#ffb3b6]">ALLERGIES</p>
                  <p className="mt-1 text-lg font-semibold">{payload.a.join(", ")}</p>
                </div>
              ) : null}

              {[
                ["Conditions", payload.c?.join(", ")],
                ["Medications", payload.m?.join(", ")],
                ["Doctor", payload.d],
                ["Insurance", payload.i],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <p className="text-xs font-bold uppercase text-[#b9c4d8]">{label}</p>
                    <p className="mt-0.5">{value}</p>
                  </div>
                ) : null,
              )}

              {payload.k?.length ? (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-[#b9c4d8]">Emergency contacts</p>
                  <ul className="space-y-2">
                    {payload.k.map((c, i) => (
                      <li key={i}>
                        <a href={`tel:${c.p.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                          <Phone size={18} className="text-mint" />
                          <span className="flex-1">
                            <span className="block font-semibold">{c.n}</span>
                            <span className="text-sm text-[#b9c4d8]">{c.r} · {c.p}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}

          <a href={`tel:${SITE.emergencyNumber}`} className="flex items-center justify-center gap-2 rounded-xl bg-danger py-3.5 text-base font-bold transition hover:bg-[#cf3a3f]">
            <PhoneCall size={18} /> Call emergency services ({SITE.emergencyNumber})
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-[#8f9bb3]">
          Shared with CareTwin AI. <Link href="/" className="underline">What is this?</Link>
        </p>
      </div>
    </main>
  );
}
