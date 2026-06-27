import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { ServiceForm } from "../service-form";
import { updateService } from "../actions";

async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  const boundUpdate = updateService.bind(null, service.id);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href="/admin/services" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-slate hover:text-signal">
        <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Retour aux services
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Modifier « {service.nom} »</h1>

      <div className="mt-8">
        <ServiceForm service={service} onSubmit={boundUpdate} />
      </div>
    </div>
  );
}
