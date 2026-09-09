"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  FileText,
  Stethoscope,
  Bot,
  Info,
  CircleHelp,
  Rocket,
  ShieldCheck,
  Leaf,
  ClipboardPlus,
  Mail,
  Clock3,
  MapPin,
  Share2,
  ArrowLeft,
} from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      alert("Please fill in all fields.");
      return;
    }

    alert("Your message has been sent successfully!");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const topics = [
    {
      title: "Getting Started",
      description:
        "Learn the basics of navigating and setting up your CareTwin profile.",
      icon: Rocket,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Account & Security",
      description:
        "Manage your privacy settings, HIPAA compliance details, and passwords.",
      icon: ShieldCheck,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "AI Tools",
      description:
        "Understand how our Human-Centric Intelligence analyzes your symptoms.",
      icon: Leaf,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Health Records",
      description:
        "Instructions on uploading, syncing, and sharing your medical history safely.",
      icon: ClipboardPlus,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-slate-800">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="flex min-h-[70px] items-center border-b border-slate-200 bg-white px-4 sm:px-6 md:px-8">

        {/* Logo */}
        <div className="w-auto shrink-0 sm:w-47.5">
          <h1 className="text-xl font-bold text-[#006B9C] sm:text-2xl">
            CareTwin
          </h1>
        </div>

        {/* Search */}
        <div className="relative ml-3 min-w-0 flex-1 sm:ml-6 sm:max-w-63.75 md:ml-0">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-full border border-slate-300 bg-[#F8F9FF] pl-10 pr-4 text-sm outline-none focus:border-cyan-600"
          />

        </div>

        {/* Header right */}
        <div className="ml-3 flex shrink-0 items-center gap-3 sm:ml-auto sm:gap-5 md:gap-7">

          <button
            type="button"
            className="text-slate-700 hover:text-cyan-700"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <button
            type="button"
            className="text-slate-700 hover:text-cyan-700"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Profile */}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-cyan-100">
            <span className="text-sm font-semibold text-cyan-700">
              R
            </span>
          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="flex">

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1">

          {/* =================================================
              HERO / SEARCH SECTION
          ================================================= */}

          <section className="bg-[#E9EDFF] px-4 py-8 sm:px-8 sm:py-10 md:px-12">

            <div className="mx-auto max-w-225">

              {/* Back to Dashboard */}
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mb-6 flex items-center gap-2 font-medium text-slate-600 transition hover:text-cyan-700 sm:mb-8"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>

              <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
                How can we help you today?
              </h2>

              <p className="mt-3 text-center text-base text-slate-600 sm:text-lg">
                Search our knowledge base or browse categories below to find
                answers.
              </p>

              {/* Large search */}
              <div className="relative mt-6 sm:mt-7">

                <Search
                  size={21}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for articles, guides, or keywords..."
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 sm:h-14 sm:text-base"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              BROWSE TOPICS
          ================================================= */}

          <section className="bg-white px-4 py-8 sm:px-8 sm:py-10 md:px-12">

            <div className="mx-auto max-w-225">

              <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
                Browse Topics
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {topics.map((topic) => {

                  const Icon = topic.icon;

                  return (
                    <button
                      type="button"
                      key={topic.title}
                      className="rounded-xl border border-slate-200 bg-[#FAF9FF] p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    >

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-lg ${topic.iconBg} ${topic.iconColor}`}
                      >
                        <Icon size={23} />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-slate-900">
                        {topic.title}
                      </h3>

                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {topic.description}
                      </p>

                    </button>
                  );

                })}

              </div>

            </div>

          </section>

          {/* =================================================
              CONTACT SECTION
          ================================================= */}

          <section className="bg-[#F0F2FF] px-4 py-8 sm:px-8 sm:py-10 md:px-12">

            <div className="mx-auto max-w-225">

              <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
                Contact Us
              </h2>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">

                {/* CONTACT FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  {/* Name */}
                  <div className="mb-4">

                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Name
                    </label>

                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Email */}
                  <div className="mb-4">

                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Subject */}
                  <div className="mb-4">

                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Subject
                    </label>

                    <input
                      type="text"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          subject: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Message */}
                  <div className="mb-5">

                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Message
                    </label>

                    <textarea
                      placeholder="Describe your issue..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />

                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-lg bg-[#006D9F] font-semibold text-white transition hover:bg-[#005D89]"
                  >
                    Send Message
                  </button>

                </form>

                {/* DIRECT SUPPORT */}

                <div className="flex min-w-0 flex-col justify-center">

                  <h2 className="text-2xl font-bold text-slate-900">
                    Direct Support
                  </h2>

                  <p className="mt-2 leading-6 text-slate-600">
                    Our team is here to help you with any technical or
                    medical record inquiries.
                  </p>

                  {/* Email */}
                  <div className="mt-7 flex min-w-0 items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Mail size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        Email Address
                      </p>

                      <p className="break-all text-sm text-slate-700">
                        rohitsinghyt43@gmail.com
                      </p>
                    </div>

                  </div>

                  {/* Hours */}
                  <div className="mt-5 flex min-w-0 items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Clock3 size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        Support Hours
                      </p>

                      <p className="text-sm text-slate-700">
                        Mon - Fri: 9:00 AM - 5:00 PM IST
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-5 flex min-w-0 items-center gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <MapPin size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        Headquarters
                      </p>

                      <p className="text-sm text-slate-700">
                        Webel IT park, Kalyani, Nadia, West Bengal, India
                      </p>
                    </div>

                  </div>

                  {/* Social */}
                  <div className="mt-7">

                    <p className="font-medium text-slate-900">
                      Follow Us
                    </p>

                    <div className="mt-3 flex gap-4">

                      <button
                        type="button"
                        className="text-cyan-700 hover:text-cyan-900"
                        aria-label="Social media"
                      >
                        <Share2 size={21} />
                      </button>

                      <button
                        type="button"
                        className="text-cyan-700 hover:text-cyan-900"
                        aria-label="Social media"
                      >
                        <Share2 size={21} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="border-t border-slate-300 bg-white px-4 py-6 sm:px-8">

            <div className="mx-auto flex max-w-275 flex-col items-center justify-between gap-4 md:flex-row">

              <p className="text-center text-sm font-semibold text-slate-800 md:text-left">
                © 2024 CareTwin. HIPAA Compliant Platform.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 sm:gap-5">

                <a
                  href="#"
                  className="hover:text-cyan-700 hover:underline"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="hover:text-cyan-700 hover:underline"
                >
                  Terms of Service
                </a>

                <a
                  href="#"
                  className="hover:text-cyan-700 hover:underline"
                >
                  HIPAA Statement
                </a>

                <a
                  href="#"
                  className="font-medium text-cyan-700 hover:underline"
                >
                  Help Center
                </a>

              </div>

            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
============================================================ */

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-slate-700 transition hover:bg-white hover:text-cyan-700"
    >
      {icon}

      <span className="text-sm font-medium">
        {label}
      </span>
    </button>
  );
}