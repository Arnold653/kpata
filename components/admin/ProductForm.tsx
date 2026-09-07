"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = { id: string; name: string };

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category_id: string;
  price: number;
  compare_at_price: number | null;
  stock_available: number;
  stock_alert_threshold: number;
  is_published: boolean;
  image_url?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductData;
}) {
  const [form, setForm] = useState<ProductData>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      brand: "",
      category_id: categories[0]?.id ?? "",
      price: 0,
      compare_at_price: null,
      stock_available: 0,
      stock_alert_threshold: 5,
      is_published: false,
      image_url: "",
    }
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
      description: form.description,
      brand: form.brand,
      category_id: form.category_id,
      price: form.price,
      compare_at_price: form.compare_at_price || null,
      stock_available: form.stock_available,
      stock_alert_threshold: form.stock_alert_threshold,
      is_published: form.is_published,
    };

    if (initial?.id) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initial.id);
      if (error) {
        setError("Erreur lors de la mise à jour.");
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();
      if (error || !data) {
        setError("Erreur lors de la création (le slug existe peut-être déjà).");
        setLoading(false);
        return;
      }
      if (form.image_url) {
        await supabase.from("product_images").insert({
          product_id: data.id,
          url: form.image_url,
          is_primary: true,
          display_order: 0,
        });
      }
    }

    router.push("/admin/produits");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    setLoading(true);
    await supabase.from("products").delete().eq("id", initial.id);
    router.push("/admin/produits");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-neutral-200 bg-white p-5">
      <div>
        <label className="mb-1 block text-sm text-neutral-600">Nom du produit</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Catégorie</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Marque</label>
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Prix (FCFA)</label>
          <input
            required
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Ancien prix (optionnel)</label>
          <input
            type="number"
            value={form.compare_at_price ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                compare_at_price: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Stock disponible</label>
          <input
            required
            type="number"
            value={form.stock_available}
            onChange={(e) =>
              setForm({ ...form, stock_available: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Seuil d'alerte</label>
          <input
            type="number"
            value={form.stock_alert_threshold}
            onChange={(e) =>
              setForm({ ...form, stock_alert_threshold: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>

      {!initial?.id && (
        <div>
          <label className="mb-1 block text-sm text-neutral-600">
            URL de l&apos;image principale
          </label>
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
        />
        Publier immédiatement
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        {initial?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600"
          >
            Supprimer
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-navy py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : initial?.id ? "Mettre à jour" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
