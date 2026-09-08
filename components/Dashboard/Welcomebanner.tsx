export default function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#121b32] px-7 py-7 text-white">
      
      {/* Content */}
      <div className="relative z-10 max-w-162.5">
        
        {/* Status */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1d2d49] px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#65f49a]" />

          <span className="text-[9px] font-semibold uppercase tracking-wide text-[#65f49a]">
            System Status: Active
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[25px] font-bold leading-[1.15] tracking-[-0.5px] sm:text-[28px]">
          Hello, Rohit! Your health
          <br />
          summary is up to date.
        </h1>

        {/* Description */}
        <p className="mt-2 max-w-130 text-[11px] leading-4.25 text-[#b9c4d8]">
          AI detected 3 improvements in your sleep patterns since the last
          sync. View your detailed medical report below.
        </p>

      </div>

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-20 -top-28 h-75 w-75 rounded-full border-35 border-[#1b2943]" />

      <div className="pointer-events-none absolute -right-5 -bottom-28 h-55 w-55 rounded-full border-25 border-[#17233b]" />

    </section>
  );
}