"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AddressForm from "@/components/AddressForm";

type Address = {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  neighborhood: string | null;
  landmark: string | null;
  is_default: boolean;
};

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  async function handleDelete(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-start justify-between rounded-card border border-neutral-100 p-3 text-sm"
        >
          <div>
            <p className="font-medium text-neutral-900">
              {addr.full_name} — {addr.phone}
            </p>
            <p className="text-neutral-500">
              {[addr.neighborhood, addr.city].filter(Boolean).join(", ")}
            </p>
          </div>
          <button
            onClick={() => handleDelete(addr.id)}
            className="text-xs text-red-500"
          >
            Supprimer
          </button>
        </div>
      ))}

      {showForm ? (
        <AddressForm
          onSaved={(addr) => {
            setAddresses((prev) => [...prev, addr]);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-full border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-navy"
        >
          + Ajouter une adresse
        </button>
      )}
    </div>
  );
}
