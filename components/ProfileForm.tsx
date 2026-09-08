"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  initialFullName,
  initialPhone,
}: {
  initialFullName: string;
  initialPhone: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", user.id);

    setStatus("done");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-neutral-600">Nom complet</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-neutral-600">Téléphone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Enregistrement..." : "Enregistrer"}
      </button>
      {status === "done" && (
        <p className="text-center text-sm text-green-600">Profil mis à jour ✓</p>
      )}
    </form>
  );
}
