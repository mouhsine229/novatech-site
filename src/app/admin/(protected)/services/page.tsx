import Link from "next/link";
import { Plus } from "lucide-react";
import { getServices } from "@/lib/queries";
import { ServicesTable } from "./services-table";

export const metadata = { title: "Services — Administration NOVATECH" };

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Services</h1>
          <p className="mt-1 font-body text-sm text-slate">Gérez les services proposés par NOVATECH.</p>
        </div>
        <Link
          href="/admin/services/nouveau"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper hover:bg-signal"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau service
        </Link>
      </div>

      <ServicesTable services={services} />
    </div>
  );
}
