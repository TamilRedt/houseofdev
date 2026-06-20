type BrandLogoProps = {
  compact?: boolean;
  inverted?: boolean;
  className?: string;
};

export function HouseOfDevMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      width={512}
      height={512}
      className={`${className} flex-none object-contain`}
      aria-hidden="true"
    />
  );
}

export function BrandLogo({ compact = false, inverted = false, className = "" }: BrandLogoProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center ${inverted ? "rounded-xl bg-[#F4F0E6] p-1.5 shadow-sm" : ""} ${className}`}
      >
        <HouseOfDevMark className="h-10 w-10" />
        <span className="sr-only">House Of Dev</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-3 ${
        inverted ? "rounded-xl bg-[#F4F0E6] px-2.5 py-2 shadow-sm" : ""
      } ${className}`}
    >
      <HouseOfDevMark className="h-11 w-11 sm:h-12 sm:w-12" />
      <span className="min-w-0 leading-none text-[#172A46]">
        <span className="block whitespace-nowrap text-[17px] font-black tracking-[0.08em] sm:text-xl">
          HOUSE OF DEV
        </span>
        <span className="mt-1 hidden whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.18em] text-[#172A46]/70 sm:block">
          Local Business Transition · Growth · Value
        </span>
      </span>
    </span>
  );
}
