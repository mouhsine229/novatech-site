import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "../service-form";
import { createService } from "../actions";

export const metadata = { title: "Nouveau service — Administration NOVATECH" };

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/services" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour aux services
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Nouveau service</h1>

      <div className="mt-8">
        <ServiceForm onSubmit={createService} />
      </div>
    </div>
  );
}
