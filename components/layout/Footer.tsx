import Link from "next/dist/client/link";

export default function Footer() {
  return (
    <footer className="bg-[#DBDFFF] text-slate-800 py-10 mt-8 shadow-md">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10 border-b border-slate-300/50 pb-8">
          
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-cyan-600 mb-2">
              CareTwin AI
            </h1>
            <p className="text-slate-700 leading-relaxed text-sm">
              Human-Centric Healthcare Intelligence for a longer and healthier life. Built with care and precision, CareTwin AI is your trusted companion in the journey towards optimal health and well-being.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12 text-sm">
            
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-xs">
                Platform
              </h3>
              <Link href="/Platform/Features" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Features
              </Link>
              <Link href="/Platform/AI_Diagnostics" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                AI Diagnostics
              </Link>
              <Link href="/Platform/Integrations" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Integrations
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-xs">
                Company
              </h3>
              <Link href="/company/About" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                About Us
              </Link>
              <Link href="/company/Contact" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-xs">
                Legal
              </h3>
              <Link href="/Legal/Privacy_Policy" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Privacy Policy
              </Link>
              <Link href="/Legal/Terms_of_Service" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Terms of Service
              </Link>
              <Link href="/Legal/HIPAA_Compliance" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                HIPAA Compliance
              </Link>
              <Link href="/Legal/Security" className="text-slate-700 hover:text-cyan-600 transition duration-200">
                Security
              </Link>
            </div>

          </div>
        </div>

        <div className="pt-6 text-sm text-slate-600">
          <p>&copy; 2026 CareTwin AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}