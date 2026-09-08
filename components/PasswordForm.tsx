"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(error ? "error" : "done");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-neutral-600">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Mise à jour..." : "Mettre à jour le mot de passe"}
      </button>
      {status === "done" && (
        <p className="text-center text-sm text-green-600">Mot de passe mis à jour ✓</p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-600">Une erreur est survenue.</p>
      )}
    </form>
  );
}
