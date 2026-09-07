"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const statuses = [
  "nouvelle", "confirmee", "en_preparation", "prete",
  "expediee", "en_livraison", "livree", "annulee", "retour",
];

const labels: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  prete: "Prête",
  expediee: "Expédiée",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
  retour: "Retour",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleChange(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {labels[s]}
        </option>
      ))}
    </select>
  );
}
