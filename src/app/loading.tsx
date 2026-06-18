import { BrandLogo } from "@/components/brand-logo";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F4F0E6] text-[#172A46]">
      <div className="text-center">
        <BrandLogo />
        <p className="mt-4 text-sm font-semibold">Preparing House Of Dev</p>
      </div>
    </main>
  );
}
