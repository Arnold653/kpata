"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function QuickAddButton({ productId }: { productId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const router = useRouter();
  const supabase = createClient();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setStatus("loading");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/connexion");
      return;
    }

    await supabase.from("cart_items").upsert(
      { user_id: user.id, product_id: productId, variant_id: null, quantity: 1 },
      { onConflict: "user_id,product_id,variant_id" }
    );

    setStatus("done");
    router.refresh();
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      aria-label="Ajouter au panier"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white disabled:opacity-60"
    >
      {status === "done" ? <Check size={16} /> : <ShoppingCart size={15} />}
    </button>
  );
}
