import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="h-20 border-b border-slate-100 flex items-center justify-between px-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex items-left gap-8">
        <h1 className="text-2xl font-bold text-cyan-600">
          CareTwin AI
        </h1>

        <div className="flex gap-8">
          <Link href="/" className="px-4 py-2 hover:text-cyan-600 transition duration-300" >
            Home
          </Link>
          <Link href="/Platform/Features" className="px-4 py-2 hover:text-cyan-600 transition duration-300" >
            Features
          </Link>
          <Link href="/company/About" className="px-4 py-2 hover:text-cyan-600 transition duration-300" >
            About
          </Link>
          <Link href="/Legal/Faqs" className="px-4 py-2 hover:text-cyan-600 transition duration-300" >
            Faqs
          </Link>
        </div>
      </div>

      <div className="flex items-right gap-0">
        <Link href="/login" className="px-4 py-2 bg-white text-slate-700 hover:text-cyan-700 transition duration-300 border-2 border-cyan-600 rounded-l-2xl ">
          Sign IN
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-cyan-600 text-white rounded-r-2xl hover:bg-cyan-700 transition duration-300">
          Join Now
        </Link>
      </div>
    </nav>
  );
}