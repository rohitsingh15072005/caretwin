import Navbar from "@/components/layout/Navbar";
export default function Features() {
  return (
    <section className="bg-[#F5F7FF] py-24">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-slate-800">
            Precision Intelligence Features
          </h2>

          <p className="mt-5 text-xl text-slate-500">
            Every feature is designed with clinical accuracy and user empathy
            at its core.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-12 gap-6">

          {/* AI Symptom Checker */}

          <div className="col-span-8 bg-white rounded-3xl shadow-sm p-8 flex justify-between items-center">

            <div className="max-w-sm">

              <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center text-2xl">
                🛡️
              </div>

              <h3 className="text-3xl font-bold mt-6 text-slate-800">
                AI Symptom Checker
              </h3>

              <p className="text-slate-500 mt-5 leading-8">
                Identify patterns before they become problems. Our proprietary
                algorithms cross-reference symptoms with medical literature in
                real time.
              </p>

              <button className="mt-8 text-cyan-600 font-semibold hover:underline">
                Learn how it works →
              </button>

            </div>

            <div className="ml-8">
              <img
                src="/images/Features_image.png"//insert the correct path to your image here
                alt="AI Symptom Checker"
                className="rounded-2xl w-[360px]"
              />
            </div>

          </div>

          {/* Medical Records */}

          <div className="col-span-4 bg-[#005D95] text-white rounded-3xl p-8">

            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              📄
            </div>

            <h3 className="text-3xl font-bold mt-6">
              Medical Record Management
            </h3>

            <p className="mt-5 leading-8 text-cyan-100">
              One unified hub for all your history. HIPAA-compliant encryption
              ensures your data remains yours.
            </p>

            <p className="mt-16 uppercase tracking-wider font-semibold text-cyan-200">
              Status: Encrypted
            </p>

          </div>

          {/* AI Health Assistant */}

          <div className="col-span-4 bg-white rounded-3xl shadow-sm p-8">

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              💬
            </div>

            <h3 className="text-3xl font-bold mt-6 text-slate-800">
              AI Health Assistant
            </h3>

            <p className="mt-5 text-slate-500 leading-8">
              Your 24/7 partner for wellness guidance, lab result
              interpretations and preventative advice.
            </p>

          </div>

          {/* Predictive Modeling */}

          <div className="col-span-8 bg-[#E9EEFF] rounded-3xl p-10 flex items-center">

            <div>

              <h3 className="text-3xl font-bold text-cyan-700">
                Predictive Modeling
              </h3>

              <p className="mt-5 text-slate-600 leading-8 max-w-2xl">
                Simulate the impact of lifestyle changes on your Health Twin
                before implementing them in real life.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}