"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Clock3, MapPin, CheckCircle2 } from "lucide-react";
import { TextArea, TextInput, btnPrimary } from "@/components/ui/Field";
import { SITE } from "@/lib/site";

export default function ContactSection({ defaults }: { defaults?: { name?: string; email?: string } }) {
  const [form, setForm] = useState({ name: defaults?.name ?? "", email: defaults?.email ?? "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    // Opens the visitor's mail app until a backend endpoint exists.
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(form.subject)}&body=${body}`;
    setSent(true);
  };

  const details = [
    { icon: Mail, label: "Email", value: SITE.supportEmail },
    { icon: Clock3, label: "Support hours", value: SITE.supportHours },
    { icon: MapPin, label: "Headquarters", value: SITE.address },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={44} className="text-[#15965d]" />
              <h3 className="mt-4 text-lg font-bold text-ink">Your email is ready to send</h3>
              <p className="mt-1.5 max-w-xs text-sm text-mute">We opened your mail app with the message filled in. Press send there to reach us.</p>
              <button type="button" className="mt-5 text-sm font-semibold text-brand hover:underline" onClick={() => setSent(false)}>
                Write another message
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="space-y-4" exit={{ opacity: 0 }}>
              <TextInput label="Name" value={form.name} error={errors.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
              <TextInput label="Email" type="email" value={form.email} error={errors.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
              <TextInput label="Subject" value={form.subject} error={errors.subject} onChange={set("subject")} placeholder="How can we help?" />
              <div>
                <TextArea label="Message" rows={5} value={form.message} onChange={set("message")} placeholder="Describe your issue..." />
                {errors.message && <p className="mt-1.5 text-xs font-medium text-danger">{errors.message}</p>}
              </div>
              <button type="submit" className={`${btnPrimary} w-full py-3`}>
                Send message
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-ink">Direct support</h2>
        <p className="mt-2 max-w-md leading-7 text-body">Our team can help with technical questions and medical-record inquiries.</p>
        <ul className="mt-7 space-y-5">
          {details.map((d) => (
            <li key={d.label} className="flex min-w-0 items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <d.icon size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{d.label}</span>
                <span className="block break-words text-sm text-body">{d.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
