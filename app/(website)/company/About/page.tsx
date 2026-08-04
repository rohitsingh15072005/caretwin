export default function About() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}

          <div className="relative">

            <img
              src="/images/Human_Centric.png"
              alt="Doctors discussing AI Healthcare"
              className="w-full rounded-3xl shadow-lg object-cover"
            />

            {/* Floating Badge */}

            

          </div>

          {/* Right Side */}

          <div>

            <h2 className="text-5xl font-bold text-slate-900">
              Human-Centric Intelligence
            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-600">
              At CareTwin AI, we believe technology should amplify humanity,
              not replace it. Our mission is to bridge the gap between cold
              data and clinical care, providing tools that empower patients
              and clinicians alike.
            </p>

            <div className="mt-12 space-y-8">

              {/* Item */}

              <div className="flex gap-5">

                <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                  ✓
                </div>

                <div>

                  <h3 className="text-2xl font-semibold text-slate-800">
                    Trust-First Policy
                  </h3>

                  <p className="text-slate-500 mt-2">
                    We never sell your data. You hold the keys to your digital twin.
                  </p>

                </div>

              </div>

              {/* Item */}

              <div className="flex gap-5">

                <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                  ✓
                </div>

                <div>

                  <h3 className="text-2xl font-semibold text-slate-800">
                    Evidence-Based AI
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Every AI model is trained on peer-reviewed clinical
                    datasets and validated by healthcare professionals.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}