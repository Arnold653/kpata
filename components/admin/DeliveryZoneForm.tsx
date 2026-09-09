"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeliveryZoneForm() {
  const [form, setForm] = useState({
    city: "", base_fee: 0, estimated_days_min: 1, estimated_days_max: 3,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from("delivery_zones").insert(form);
    setForm({ city: "", base_fee: 0, estimated_days_min: 1, estimated_days_max: 3 });
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 lg:grid-cols-5">
      <input
        required
        placeholder="Ville"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <input
        required
        type="number"
        placeholder="Frais (FCFA)"
        value={form.base_fee || ""}
        onChange={(e) => setForm({ ...form, base_fee: Number(e.target.value) })}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <input
        type="number"
        placeholder="Délai min (jours)"
        value={form.estimated_days_min}
        onChange={(e) => setForm({ ...form, estimated_days_min: Number(e.target.value) })}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <input
        type="number"
        placeholder="Délai max (jours)"
        value={form.estimated_days_max}
        onChange={(e) => setForm({ ...form, estimated_days_max: Number(e.target.value) })}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Ajout..." : "+ Ajouter"}
      </button>
    </form>
  );
}
