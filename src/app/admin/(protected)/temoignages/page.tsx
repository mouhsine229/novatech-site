import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";
import { TestimonialsManager } from "./testimonials-manager";

export const metadata = { title: "Témoignages — Administration NOVATECH" };

async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-ink">Témoignages</h1>
      <p className="mt-1 font-body text-sm text-slate">
        Validez les témoignages reçus avant qu&rsquo;ils n&rsquo;apparaissent sur le site public.
      </p>

      <div className="mt-8">
        <TestimonialsManager testimonials={testimonials} />
      </div>
    </div>
  );
}
