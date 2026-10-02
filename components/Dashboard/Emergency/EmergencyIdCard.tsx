"use client";

import { Droplet, HeartPulse, Phone, ShieldAlert } from "lucide-react";
import { qrPath, qrViewBox, type QrMatrix } from "@/lib/qr";
import type { EmergencyPayload } from "@/lib/emergency";

/** The printable card. Everything inside #print-area is what gets printed. */
export default function EmergencyIdCard({ payload, qr }: { payload: EmergencyPayload; qr: QrMatrix | null }) {
  return (
    <div id="print-area" className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-navy text-white shadow-xl">
      <div className="flex items-center justify-between bg-danger px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <ShieldAlert size={18} /> EMERGENCY MEDICAL ID
        </div>
        <span className="text-xs font-semibold text-white/80">CareTwin AI</span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="truncate text-2xl font-bold leading-tight">{payload.n}</p>
            {payload.g !== undefined && <p className="text-sm text-[#b9c4d8]">{payload.g} years old</p>}
          </div>

          <div className="flex flex-wrap gap-3">
            {payload.b && (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <Droplet size={18} className="text-[#ff7b80]" />
                <div>
                  <p className="text-[11px] text-[#b9c4d8]">Blood group</p>
                  <p className="text-xl font-bold leading-none">{payload.b}</p>
                </div>
              </div>
            )}
            {payload.o !== undefined && (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <HeartPulse size={18} className="text-mint" />
                <div>
                  <p className="text-[11px] text-[#b9c4d8]">Organ donor</p>
                  <p className="text-base font-bold leading-none">{payload.o ? "Yes" : "No"}</p>
                </div>
              </div>
            )}
          </div>

          {payload.a?.length ? (
            <div className="rounded-lg border border-[#ff7b80]/50 bg-danger/20 px-3 py-2">
              <p className="text-[11px] font-bold text-[#ffb3b6]">ALLERGIES</p>
              <p className="text-sm font-semibold">{payload.a.join(", ")}</p>
            </div>
          ) : null}

          {payload.c?.length ? <Row label="Conditions" value={payload.c.join(", ")} /> : null}
          {payload.m?.length ? <Row label="Medications" value={payload.m.join(", ")} /> : null}
          {payload.d ? <Row label="Doctor" value={payload.d} /> : null}
          {payload.i ? <Row label="Insurance" value={payload.i} /> : null}

          {payload.k?.length ? (
            <div>
              <p className="text-[11px] font-bold text-[#b9c4d8]">EMERGENCY CONTACTS</p>
              <ul className="mt-1 space-y-1">
                {payload.k.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Phone size={13} className="text-mint" />
                    <span className="font-semibold">{c.n}</span>
                    <span className="text-[#b9c4d8]">({c.r})</span>
                    <span>{c.p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-start gap-2 sm:items-end">
          <div className="rounded-xl bg-white p-2">
            {qr ? (
              <svg viewBox={qrViewBox(qr)} className="h-36 w-36 sm:h-40 sm:w-40" shapeRendering="crispEdges" role="img" aria-label="Emergency QR code">
                <path d={qrPath(qr)} fill="#111827" />
              </svg>
            ) : (
              <div className="flex h-36 w-36 items-center justify-center text-center text-xs text-mute sm:h-40 sm:w-40">QR unavailable</div>
            )}
          </div>
          <p className="text-xs text-[#b9c4d8]">Scan for full details</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-[#b9c4d8]">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
