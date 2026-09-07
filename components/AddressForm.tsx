"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Address = {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  neighborhood: string | null;
  landmark: string | null;
  delivery_instructions: string | null;
  is_default: boolean;
};

export default function AddressForm({
  onSaved,
  onCancel,
}: {
  onSaved: (address: Address) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    city: "",
    neighborhood: "",
    landmark: "",
    delivery_instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...form, user_id: user.id })
      .select()
      .single();

    if (error || !data) {
      setError("Impossible d'enregistrer l'adresse. Réessayez.");
      setLoading(false);
      return;
    }

    onSaved(data as Address);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        required
        placeholder="Nom complet"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
      <input
        required
        placeholder="Téléphone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
      <input
        required
        placeholder="Ville"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
      <input
        placeholder="Quartier"
        value={form.neighborhood}
        onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
      <input
        placeholder="Point de repère"
        value={form.landmark}
        onChange={(e) => setForm({ ...form, landmark: e.target.value })}
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
      <textarea
        placeholder="Instructions de livraison (optionnel)"
        value={form.delivery_instructions}
        onChange={(e) =>
          setForm({ ...form, delivery_instructions: e.target.value })
        }
        className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
        rows={2}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-navy py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
      </div>
    </form>
  );
}
