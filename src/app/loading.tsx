import { Container } from "@/components/container";

export default function Loading() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </Container>
    </section>
  );
}

