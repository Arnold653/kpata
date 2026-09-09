"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PromotionForm() {
  const [form, setForm] = useState({
    title: "", description: "", discount_type: "percentage", discount_value: 10,
    starts_at: "", ends_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("promotions").insert(form);
    if (error) { setError("Erreur lors de la création."); setLoading(false); return; }
    router.refresh();
    setForm({ title: "", description: "", discount_type: "percentage", discount_value: 10, starts_at: "", ends_at: "" });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy">
          <option value="percentage">Pourcentage</option>
          <option value="fixed_amount">Montant fixe</option>
        </select>
        <input required type="number" placeholder="Valeur" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        <input required type="date" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        <input required type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? "Création..." : "+ Créer la promotion"}
      </button>
    </form>
  );
}
