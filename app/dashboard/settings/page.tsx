"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="min-h-screen bg-[#F5F7FF] p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">

          {/* Settings navigation */}
          <div className="space-y-4">

            {/* Back to Dashboard */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mb-4 flex items-center gap-2 font-medium text-slate-700 transition hover:text-[#006B9F]"
            >
              <span className="text-2xl">←</span>
              <span>Back to Dashboard</span>
            </button>

            {/* Sidebar buttons */}
            <div className="space-y-2">
              {[
                "Profile",
                "Security",
                "Health Data & Privacy",
                "Notifications",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveTab(item)}
                  className={`w-full rounded-xl px-5 py-3 text-left transition ${
                    activeTab === item
                      ? "bg-[#DCE8FA] font-semibold text-[#006B9F]"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          {/* Settings content */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5 sm:p-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Profile Information
              </h2>

              <p className="mt-2 text-slate-500">
                Update your account details and public profile.
              </p>
            </div>

            <div className="p-5 sm:p-7">

              {/* Profile Picture */}
              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  👤
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    Profile Picture
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    PNG, JPG up to 5MB.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">

                    <button
                      type="button"
                      className="rounded-lg bg-[#DCE8FA] px-4 py-2 text-[#006B9F]"
                    >
                      Upload New
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 text-red-600"
                    >
                      Remove
                    </button>

                  </div>
                </div>

              </div>

              {/* Name */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    First Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Rohit"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Last Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Singh"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black outline-none focus:border-cyan-600"
                  />
                </div>

              </div>

              {/* Email */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Email Address
                </label>

                <input
                  type="email"
                  defaultValue="rohitsinghyt43@gmail.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black outline-none focus:border-cyan-600"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:p-6">

              <button
                type="button"
                className="rounded-full border border-slate-300 px-6 py-3 text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-full bg-[#006B9F] px-7 py-3 font-semibold text-white"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}