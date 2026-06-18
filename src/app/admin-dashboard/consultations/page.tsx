import { AdminConsultationsPage } from "@/components/admin-consultations-page";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ConsultationsPage({ searchParams }: Props) {
  return <AdminConsultationsPage searchParams={await searchParams} />;
}
