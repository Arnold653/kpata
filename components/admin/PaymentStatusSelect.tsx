"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const statuses = ["en_attente", "paye", "echoue", "rembourse"];
const labels: Record<string, string> = {
  en_attente: "En attente",
  paye: "Payé",
  echoue: "Échoué",
  rembourse: "Remboursé",
};

export default function PaymentStatusSelect({
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
    await supabase.from("orders").update({ payment_status: newStatus }).eq("id", orderId);
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
        <option key={s} value={s}>{labels[s]}</option>
      ))}
    </select>
  );
}
