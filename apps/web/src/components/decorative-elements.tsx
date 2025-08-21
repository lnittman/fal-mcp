export function DecorativeElements() {
  return (
    <>
      {/* Left decorative elements */}
      <div className="pointer-events-none absolute -left-[20px] top-[80px] h-[226px] w-[457px] max-w-[457px] xl:left-0 xl:top-[119px] xl:h-auto opacity-20">
        <svg viewBox="0 0 457 226" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="457" height="226" fill="url(#grad-left-1)" />
          <defs>
            <linearGradient id="grad-left-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#125DF3" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6120EE" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right decorative element */}
      <div className="pointer-events-none absolute bottom-10 right-10 xl:bottom-[52px] xl:right-[300px] opacity-15">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="#4A6D03" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="60" cy="60" r="30" fill="#F0FAE6" opacity="0.3" />
        </svg>
      </div>

      {/* Abstract geometric shapes */}
      <div className="pointer-events-none absolute left-0 top-[400px] -z-10 h-[277px] w-[404px] max-w-[404px] lg:h-auto opacity-10">
        <svg viewBox="0 0 404 277" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L404 0L202 277Z" fill="#D23768" opacity="0.1" />
          <rect x="100" y="50" width="100" height="100" fill="#FEF0F5" opacity="0.5" />
        </svg>
      </div>

      {/* Floating circles */}
      <div className="pointer-events-none absolute -right-[100px] top-[200px] opacity-20">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#D6EFFF" />
          <circle cx="120" cy="120" r="40" fill="#125DF3" opacity="0.2" />
        </svg>
      </div>
    </>
  );
}

export function QuickStartDecorative() {
  return (
    <>
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-20 top-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-green-400/10 to-yellow-400/10 blur-3xl animate-pulse animation-delay-2000" />
    </>
  );
}

export function CTADecorative() {
  return (
    <>
      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute left-10 bottom-10 w-20 h-20">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="60" height="60" stroke="white" strokeWidth="1" opacity="0.2" transform="rotate(45 40 40)" />
        </svg>
      </div>
      
      <div className="pointer-events-none absolute right-10 top-10 w-16 h-16">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="32,8 58,48 6,48" stroke="white" strokeWidth="1" opacity="0.2" fill="none" />
        </svg>
      </div>
    </>
  );
}

export function TrustedBySection() {
  return (
    <section className="py-16 px-6 md:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Trusted by over <span className="font-semibold text-gray-900">1,000,000</span> developers
          </p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>
      </div>
    </section>
  );
}