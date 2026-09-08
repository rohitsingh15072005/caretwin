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

      <header className="h-17.5 bg-white border-b border-slate-200 flex items-center px-8">

        {/* Logo */}

        <div className="w-47.5 shrink-0">
          <h1 className="text-2xl font-bold text-[#006B9C]">
            CareTwin
          </h1>
        </div>

        {/* Search */}

        <div className="relative w-63.75">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-full border border-slate-300 bg-[#F8F9FF] text-sm outline-none focus:border-cyan-600"
          />

        </div>

        {/* Header right */}

        <div className="ml-auto flex items-center gap-7">

          <button
            type="button"
            className="text-slate-700 hover:text-cyan-700"
          >
            <Bell size={21} />
          </button>

          <button
            type="button"
            className="text-slate-700 hover:text-cyan-700"
          >
            <Settings size={21} />
          </button>

          {/* Profile */}

          <div className="w-9 h-9 rounded-full border-2 border-slate-200 bg-cyan-100 flex items-center justify-center overflow-hidden">
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

        <main className="flex-1">

          {/* =================================================
              HERO / SEARCH SECTION
          ================================================= */}

          <section className="bg-[#E9EDFF] px-8 md:px-12 py-10">

            <div className="max-w-225 mx-auto">

              {/* Back to Dashboard */}

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-slate-600 hover:text-cyan-700 transition font-medium mb-8"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>

              <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900">
                How can we help you today?
              </h2>

              <p className="text-center text-lg text-slate-600 mt-3">
                Search our knowledge base or browse categories below to find
                answers.
              </p>

              {/* Large search */}

              <div className="relative mt-7">

                <Search
                  size={21}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for articles, guides, or keywords..."
                  className="w-full h-14 pl-12 pr-5 rounded-xl border border-slate-300 bg-white text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              BROWSE TOPICS
          ================================================= */}

          <section className="bg-white px-8 md:px-12 py-10">

            <div className="max-w-225 mx-auto">

              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Browse Topics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {topics.map((topic) => {

                  const Icon = topic.icon;

                  return (
                    <button
                      type="button"
                      key={topic.title}
                      className="text-left bg-[#FAF9FF] border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-1 transition duration-200"
                    >

                      <div
                        className={`w-11 h-11 rounded-lg ${topic.iconBg} ${topic.iconColor} flex items-center justify-center`}
                      >
                        <Icon size={23} />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mt-5">
                        {topic.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-5 mt-2">
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

          <section className="bg-[#F0F2FF] px-8 md:px-12 py-10">

            <div className="max-w-225 mx-auto">

              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Contact Us
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* CONTACT FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
                >

                  {/* Name */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium text-slate-800 mb-1">
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
                      className="w-full h-11 px-4 rounded-lg border border-slate-300 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Email */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium text-slate-800 mb-1">
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
                      className="w-full h-11 px-4 rounded-lg border border-slate-300 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Subject */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium text-slate-800 mb-1">
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
                      className="w-full h-11 px-4 rounded-lg border border-slate-300 outline-none focus:border-cyan-600"
                    />

                  </div>

                  {/* Message */}

                  <div className="mb-5">

                    <label className="block text-sm font-medium text-slate-800 mb-1">
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none resize-none focus:border-cyan-600"
                    />

                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-[#006D9F] text-white font-semibold hover:bg-[#005D89] transition"
                  >
                    Send Message
                  </button>

                </form>

                {/* DIRECT SUPPORT */}

                <div className="flex flex-col justify-center">

                  <h2 className="text-2xl font-bold text-slate-900">
                    Direct Support
                  </h2>

                  <p className="text-slate-600 mt-2 leading-6">
                    Our team is here to help you with any technical or
                    medical record inquiries.
                  </p>

                  {/* Email */}

                  <div className="flex items-center gap-4 mt-7">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Mail size={19} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        Email Address
                      </p>

                      <p className="text-sm text-slate-700">
                        rohitsinghyt43@gmail.com
                      </p>
                    </div>

                  </div>

                  {/* Hours */}

                  <div className="flex items-center gap-4 mt-5">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        Support Hours
                      </p>

                      <p className="text-sm text-slate-700">
                        Mon - Fri: 9:00 AM - 5:00 PM IST
                      </p>
                    </div>

                  </div>

                  {/* Location */}

                  <div className="flex items-center gap-4 mt-5">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <MapPin size={19} />
                    </div>

                    <div>
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

                    <div className="flex gap-4 mt-3">

                      <button
                        type="button"
                        className="text-cyan-700 hover:text-cyan-900"
                      >
                        <Share2 size={21} />
                      </button>

                      <button
                        type="button"
                        className="text-cyan-700 hover:text-cyan-900"
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

          <footer className="bg-white border-t border-slate-300 px-8 py-6">

            <div className="max-w-275 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

              <p className="text-sm font-semibold text-slate-800">
                © 2024 CareTwin. HIPAA Compliant Platform.
              </p>

              <div className="flex flex-wrap gap-5 text-sm text-slate-600">

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
                  className="text-cyan-700 font-medium hover:underline"
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
      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-700 hover:bg-white hover:text-cyan-700 transition text-left"
    >
      {icon}

      <span className="text-sm font-medium">
        {label}
      </span>
    </button>
  );
}