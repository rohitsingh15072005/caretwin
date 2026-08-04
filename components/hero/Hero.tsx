export default function Hero() {
  return (
    <section className="w-full min-h-[85vh] bg-[#F8FBFF] flex items-center">
      <div className="max-w-7xl mx-auto w-full px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-sm">
              ⚡ PRECISION HEALTH PLATFORM
            </div>

            <h1 className="mt-8 text-6xl font-bold leading-tight text-slate-900">
              Your AI{" "}
              <span className="italic text-cyan-600">
                Health Twin
              </span>
            </h1>

            <p className="mt-8 text-xl text-slate-500 leading-9 max-w-xl">
              Synthesizing thousands of health data points into a personalized
              digital replica. Gain predictive insights and clinical-grade
              intelligence for your well-being.
            </p>

            <div className="flex gap-5 mt-10">

              <button className="bg-cyan-700 hover:bg-cyan-800 transition text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
                Join MedBud →
              </button>

              <button className="border border-slate-300 hover:border-cyan-600 hover:text-cyan-600 transition px-8 py-4 rounded-xl font-semibold bg-white">
                Explore Features
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="bg-white rounded-3xl shadow-2xl p-8">

              <div className="flex justify-between items-start">

                <div className="flex gap-4 items-center">

                  <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center text-white text-2xl">
                    ❤
                  </div>

                  <div>

                    <p className="uppercase text-sm text-slate-400 font-semibold">
                      Vital Analysis
                    </p>

                    <h2 className="text-4xl font-bold text-slate-800">
                      Optimal Recovery
                    </h2>

                  </div>

                </div>

                <div className="text-cyan-400 text-4xl">
                  🔬
                </div>

              </div>

              {/* Graph */}

              <div className="mt-8 bg-[#EDF3FF] rounded-2xl h-72 flex justify-around items-end px-10 pb-6">

                <div className="w-6 bg-cyan-700 rounded-t h-20"></div>

                <div className="w-6 bg-cyan-700 rounded-t h-32"></div>

                <div className="w-6 bg-cyan-700 rounded-t h-24"></div>

                <div className="w-6 bg-cyan-700 rounded-t h-44"></div>

                <div className="w-6 bg-cyan-700 rounded-t h-34"></div>

                <div className="w-6 bg-cyan-700 rounded-t h-48"></div>

              </div>

              {/* Bottom Cards */}

              <div className="grid grid-cols-2 gap-5 mt-6">

                <div className="bg-[#F5F7FF] rounded-2xl p-6">

                  <p className="text-slate-400 font-medium">
                    Stress Level
                  </p>

                  <h3 className="text-4xl font-bold mt-2">
                    Low
                  </h3>

                </div>

                <div className="bg-[#F5F7FF] rounded-2xl p-6">

                  <p className="text-slate-400 font-medium">
                    AI Forecast
                  </p>

                  <h3 className="text-3xl font-bold text-green-500 mt-2">
                    +12% Energy
                  </h3>

                </div>

              </div>

            </div>

            {/* Floating Badge */}

            <div className="absolute -bottom-6 left-8 bg-white border border-cyan-300 shadow-xl rounded-xl px-6 py-4 flex items-center gap-3">

              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                ✓
              </div>

              <span className="font-semibold text-slate-700">
                Verified by CareTwin AI
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}