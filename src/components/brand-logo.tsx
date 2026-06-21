type BrandLogoProps = {
  compact?: boolean;
  inverted?: boolean;
  className?: string;
};

export function HouseOfDevMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src="/favicon-v2.svg"
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
      className={`inline-flex min-w-0 items-center ${
        inverted ? "rounded-xl bg-[#F4F0E6] px-2 py-1.5 shadow-sm" : ""
      } ${className}`}
    >
      <img
        src="/brand/houseofdev-logo-horizontal.svg"
        alt="House Of Dev — Local Business Transition, Growth, Value"
        width={920}
        height={321}
        className="h-10 w-auto max-w-[185px] object-contain sm:h-11 sm:max-w-[215px] lg:h-12 lg:max-w-[245px]"
      />
    </span>
  );
}
