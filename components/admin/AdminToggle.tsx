"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminToggle({
  table,
  id,
  field,
  value,
  activeLabel = "Actif",
  inactiveLabel = "Inactif",
}: {
  table: string;
  id: string;
  field: string;
  value: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function toggle() {
    setLoading(true);
    await supabase.from(table).update({ [field]: !value }).eq("id", id);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        value ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
      }`}
    >
      {value ? activeLabel : inactiveLabel}
    </button>
  );
}
