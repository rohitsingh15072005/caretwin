"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="min-h-screen bg-[#F5F7FF] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

          {/* Settings navigation */}
          <div className="space-y-4">

            {/* Back to Dashboard */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-slate-700 hover:text-[#006B9F] font-medium transition mb-4"
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
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-5 py-3 rounded-xl transition ${
                    activeTab === item
                      ? "bg-[#DCE8FA] text-[#006B9F] font-semibold"
                      : "hover:bg-white text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          {/* Settings content */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="p-7 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                Profile Information
              </h2>

              <p className="text-slate-500 mt-2">
                Update your account details and public profile.
              </p>
            </div>

            <div className="p-7">

              {/* Profile Picture */}
              <div className="flex items-center gap-5 mb-8">

                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                  👤
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Profile Picture
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    PNG, JPG up to 5MB.
                  </p>

                  <div className="flex gap-3 mt-3">

                    <button className="px-4 py-2 rounded-lg bg-[#DCE8FA] text-[#006B9F]">
                      Upload New
                    </button>

                    <button className="px-4 py-2 text-red-600">
                      Remove
                    </button>

                  </div>
                </div>

              </div>

              {/* Name */}
              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900">
                    First Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Rohit"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900">
                    Last Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Singh"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-black"
                  />
                </div>

              </div>

              {/* Email */}
              <div className="mt-5">

                <label className="block text-sm font-medium mb-2 text-slate-900">
                  Email Address
                </label>

                <input
                  type="email"
                  defaultValue="rohitsinghyt43@gmail.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-black"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="border-t border-slate-200 p-6 flex justify-end gap-3">

              <button className="px-6 py-3 rounded-full border border-slate-300 text-slate-700">
                Cancel
              </button>

              <button className="px-7 py-3 rounded-full bg-[#006B9F] text-white font-semibold">
                Save Changes
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}