"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QrCode, Download, Printer, Copy, Link2, FileText, TriangleAlert, Info } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import MemberTabs from "@/components/shared/MemberTabs";
import EmergencyIdCard from "@/components/Dashboard/Emergency/EmergencyIdCard";
import { Toggle, btnGhost, btnPrimary } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { useCareData } from "@/lib/useCareData";
import {
  DEFAULT_FIELDS,
  buildPayload,
  payloadToLink,
  payloadToText,
  type EmergencyFields,
} from "@/lib/emergency";
import { downloadQrPng, downloadQrSvg, makeQr } from "@/lib/qr";
import { slug } from "@/lib/download";

const FIELD_LABELS: { key: keyof EmergencyFields; label: string }[] = [
  { key: "age", label: "Age" },
];

export default function EmergencyPage() {
  const toast = useToast();
  const { hydrated, now, self, profileState } = useCareData();
  const [fields, setFields] = useState<EmergencyFields>(DEFAULT_FIELDS);
  const [mode, setMode] = useState<"link" | "text">("link");

  const member = self;
  const payload = useMemo(() => buildPayload(member, fields, now), [member, fields, now]);

  const origin = hydrated ? window.location.origin : "";
  const content = mode === "link" ? payloadToLink(payload, origin) : payloadToText(payload);

  const { qr, error } = useMemo(() => {
    if (!hydrated) return { qr: null, error: "" };
    try {
      return { qr: makeQr(content), error: "" };
    } catch {
      return { qr: null, error: "There is too much information for one QR code. Turn off a few fields." };
    }
  }, [content, hydrated]);

  const isLocal = hydrated && /localhost|127\.0\.0\.1|192\.168\./.test(origin);
  const nothingShared = Object.keys(payload).length <= 2; // only version + name
  const base = `emergency-${slug(member.name)}`;

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(msg);
    } catch {
      toast("Copy is blocked by the browser", "error");
    }
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1200px] space-y-5">
      <StaggerItem>
        <PageHeader
          icon={<QrCode size={22} />}
          title="Emergency QR"
          subtitle="Create a QR card with the account details available to CareTwin. Medical details and emergency contacts are not supported by the connected profile API."
        />
      </StaggerItem>

      <StaggerItem>
        <MemberTabs />
      </StaggerItem>

      <StaggerItem>
        {profileState.status === "error" && (
          <div role="alert" className="rounded-lg border border-[#f3b5b5] bg-white px-4 py-3 text-sm text-danger">
            Could not load your profile, so the QR preview contains no account details. {profileState.error}
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          {/* Controls */}
          <div className="no-print space-y-5">
            <section className="rounded-xl border border-line bg-white p-5">
              <h2 className="text-sm font-bold text-ink">What should the card show?</h2>
              <p className="mt-1 text-[13px] leading-5 text-mute">Only your name and, if available, age can currently be populated from your profile.</p>
              <div className="mt-1 divide-y divide-[#f0f2f6]">
                {FIELD_LABELS.map((f) => (
                  <Toggle
                    key={f.key}
                    checked={fields[f.key]}
                    onChange={(v) => setFields({ ...fields, [f.key]: v })}
                    label={f.label}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-line bg-white p-5">
              <h2 className="text-sm font-bold text-ink">QR type</h2>
              <div role="radiogroup" aria-label="QR type" className="mt-3 grid grid-cols-2 gap-2">
                {([
                  ["link", "Opens a page", Link2],
                  ["text", "Plain text", FileText],
                ] as const).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={mode === id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition ${
                      mode === id ? "border-brand bg-brand-soft text-brand" : "border-[#dfe3ea] text-body hover:border-brand/50"
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-5 text-mute">
                {mode === "link"
                  ? "Scanning opens a clear emergency page with tap-to-call buttons. The details are stored inside the link, not on a server."
                  : "Scanning shows the details as text in any scanner app and works with no internet. Best for a printed card."}
              </p>
            </section>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            {mode === "link" && isLocal && (
              <div className="no-print flex gap-3 rounded-xl border border-[#f0dfc1] bg-[#fffaf0] p-4 text-[13px] leading-5 text-[#7a5c1f]">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p>
                  You are running locally, so a phone cannot open this link. Use <b>Plain text</b>, or generate the QR again once the app is deployed.
                </p>
              </div>
            )}
            {nothingShared && (
              <div className="no-print flex gap-3 rounded-xl border border-[#f0dfc1] bg-[#fffaf0] p-4 text-[13px] text-[#7a5c1f]">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                <p>
                  No optional profile details are available to include. CareTwin currently only provides your account name and date of birth for this card.
                </p>
              </div>
            )}
            {error && (
              <div role="alert" className="no-print flex gap-3 rounded-xl border border-[#f3b5b5] bg-danger-soft p-4 text-[13px] text-danger">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="rounded-2xl bg-[#e9edff] p-4 sm:p-8">
              {hydrated ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${member.id}-${mode}-${content.length}`}
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto flex justify-center"
                  >
                    <EmergencyIdCard payload={payload} qr={qr} />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="ct-skeleton mx-auto h-72 max-w-[560px] rounded-2xl" />
              )}
            </div>

            <div className="no-print flex flex-wrap gap-2">
              <button type="button" className={btnPrimary} disabled={!qr} onClick={() => qr && downloadQrPng(qr, `${base}.png`)}>
                <Download size={16} /> Download PNG
              </button>
              <button type="button" className={btnGhost} disabled={!qr} onClick={() => qr && downloadQrSvg(qr, `${base}.svg`)}>
                <Download size={16} /> SVG
              </button>
              <button type="button" className={btnGhost} onClick={() => window.print()}>
                <Printer size={16} /> Print card
              </button>
              <button type="button" className={btnGhost} onClick={() => copy(payloadToText(payload), "Details copied")}>
                <Copy size={16} /> Copy details
              </button>
              {mode === "link" && (
                <button type="button" className={btnGhost} onClick={() => copy(content, "Link copied")}>
                  <Link2 size={16} /> Copy link
                </button>
              )}
            </div>

            <p className="no-print text-[13px] leading-5 text-mute">
              Anyone who scans this code can read the fields above, so only include what a responder needs. If your details change, generate a new code.
            </p>
          </div>
        </div>
      </StaggerItem>
    </Stagger>
  );
}
