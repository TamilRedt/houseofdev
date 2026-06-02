import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <section className="premium-gradient py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">404</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">This page is not available</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The route may have moved, or the project detail you are looking for does not exist.
          </p>
          <div className="mt-8">
            <ButtonLink href="/">Back to Home</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

