"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ParentOption = { id: string; name: string };

type CategoryData = {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoryForm({
  parents,
  initial,
}: {
  parents: ParentOption[];
  initial?: CategoryData;
}) {
  const [form, setForm] = useState<CategoryData>(
    initial ?? { name: "", slug: "", icon: "🛍️", parent_id: null, display_order: 0, is_active: true }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      icon: form.icon,
      parent_id: form.parent_id || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    if (initial?.id) {
      const { error } = await supabase.from("categories").update(payload).eq("id", initial.id);
      if (error) { setError("Erreur lors de la mise à jour."); setLoading(false); return; }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { setError("Erreur (le slug existe peut-être déjà)."); setLoading(false); return; }
    }

    router.push("/admin/categories");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Supprimer cette catégorie ?")) return;
    setLoading(true);
    await supabase.from("categories").delete().eq("id", initial.id);
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <div>
        <label className="mb-1 block text-sm text-neutral-600">Nom</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Icône (emoji)</label>
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Ordre d'affichage</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Catégorie parente (optionnel)</label>
        <select
          value={form.parent_id ?? ""}
          onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        >
          <option value="">— Aucune (catégorie principale) —</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        Catégorie active
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        {initial?.id && (
          <button type="button" onClick={handleDelete} className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600">
            Supprimer
          </button>
        )}
        <button type="submit" disabled={loading} className="flex-1 rounded-full bg-navy py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Enregistrement..." : initial?.id ? "Mettre à jour" : "Créer la catégorie"}
        </button>
      </div>
    </form>
  );
}
