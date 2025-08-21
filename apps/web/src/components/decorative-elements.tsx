import Image from "next/image";

export function DecorativeElements() {
  return (
    <>
      {/* Left top decorative pixel art - exact from fal.ai */}
      <div className="pointer-events-none absolute -left-[20px] top-[80px] h-[226px] w-[457px] max-w-[457px] xl:left-0 xl:top-[119px] xl:h-auto z-0">
        <Image
          src="/decorative/left-1.webp"
          alt=""
          width={457}
          height={226}
          className="opacity-70"
          priority
        />
      </div>

      {/* Right bottom decorative element - exact from fal.ai */}
      <div className="pointer-events-none absolute bottom-10 right-10 xl:bottom-[52px] xl:right-[300px] z-0">
        <Image
          src="/decorative/right-1.svg"
          alt=""
          width={120}
          height={120}
          className="opacity-60"
        />
      </div>

      {/* Left middle decorative - mix-blend-multiply for subtle overlay */}
      <div className="pointer-events-none absolute top-[300px] -left-10 z-10 h-[534px] mix-blend-multiply lg:h-auto">
        <Image
          src="/decorative/left-3.svg"
          alt=""
          width={300}
          height={534}
          className="opacity-30"
        />
      </div>

      {/* Top edge decorative */}
      <div className="pointer-events-none absolute -top-[220px] left-0 z-10 hidden h-[555px] lg:block xl:-top-[30px]">
        <Image
          src="/decorative/left-6.svg"
          alt=""
          width={269}
          height={555}
          className="opacity-20"
        />
      </div>
    </>
  );
}

export function QuickStartDecorative() {
  return (
    <>
      {/* Left decorative SVG with abstract shapes */}
      <div className="pointer-events-none absolute -left-10 top-[100px] -z-10 hidden lg:block">
        <Image
          src="/decorative/left-2.svg"
          alt=""
          width={269}
          height={208}
          className="opacity-40"
        />
      </div>

      {/* Right side decorative */}
      <div className="pointer-events-none absolute -right-20 top-[200px] -z-10 h-[277px] w-[404px] max-w-[404px] lg:h-auto">
        <Image
          src="/decorative/right-5.svg"
          alt=""
          width={404}
          height={277}
          className="opacity-30"
        />
      </div>

      {/* Subtle gradient orbs for additional depth */}
      <div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-purple-400/5 to-blue-400/5 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-40 top-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-green-400/5 to-yellow-400/5 blur-3xl animate-pulse animation-delay-2000" />
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

      {/* Left decorative element */}
      <div className="pointer-events-none absolute left-[181px] top-[20px] z-10 hidden lg:h-auto xl:block">
        <Image
          src="/decorative/left-4.svg"
          alt=""
          width={100}
          height={100}
          className="opacity-20"
        />
      </div>

      {/* Floating pixel art shapes */}
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