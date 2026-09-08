"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error("Failed to load user settings:", err);
      }
    }
    loadUser();
  }, []);

  const nameParts = user?.full_name ? user.full_name.split(" ") : ["User", ""];
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="min-h-screen bg-[#F5F7FF] p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

          {/* Settings navigation */}

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

                {activeTab === item && (
                  <span className="float-right text-xs bg-[#006B9F] text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}

          </div>


          {/* Main content */}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200">

            <div className="p-8">

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Personal Information
              </h2>

              <p className="text-slate-500 mb-8">
                Manage your personal details and account settings.
              </p>


              {/* Profile */}

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

                    <button className="px-4 py-2 rounded-lg bg-[#DCE8FA] text-[#006B9F] text-xs font-semibold">
                      Upload New
                    </button>

                    <button className="px-4 py-2 text-red-600 text-xs font-semibold">
                      Remove
                    </button>

                  </div>

                </div>

              </div>


              {/* Name */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    key={firstName}
                    defaultValue={firstName}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-sm"
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    key={lastName}
                    defaultValue={lastName}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-sm"
                  />

                </div>

              </div>


              {/* Email */}

              <div className="mt-5">

                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  key={user?.email || "email"}
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-600 text-sm"
                />

              </div>

            </div>


            {/* Buttons */}

            <div className="border-t border-slate-200 p-6 flex justify-end gap-3">

              <button className="px-6 py-3 rounded-full border border-slate-300 text-sm">
                Cancel
              </button>

              <button className="px-6 py-3 rounded-full bg-[#006B9F] hover:bg-[#00557f] text-white text-sm font-semibold transition">
                Save Changes
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}