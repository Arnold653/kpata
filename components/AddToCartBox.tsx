"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Variant = {
  id: string;
  color: string | null;
  size: string | null;
  stock: number;
};

export default function AddToCartBox({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const router = useRouter();
  const supabase = createClient();

  const colors = [...new Set(variants.filter((v) => v.color).map((v) => v.color))];
  const sizes = [...new Set(variants.filter((v) => v.size).map((v) => v.size))];

  async function addToCart(buyNow: boolean) {
    setStatus("loading");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/connexion");
      return;
    }

    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        product_id: productId,
        variant_id: selectedVariant,
        quantity,
      },
      { onConflict: "user_id,product_id,variant_id" }
    );

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("done");
    if (buyNow) router.push("/panier");
  }

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Couleur</p>
          <div className="flex gap-2">
            {variants
              .filter((v) => v.color)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    selectedVariant === v.id
                      ? "border-navy bg-navy text-white"
                      : "border-neutral-200 text-neutral-700"
                  }`}
                >
                  {v.color}
                </button>
              ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Taille</p>
          <div className="flex flex-wrap gap-2">
            {variants
              .filter((v) => v.size)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`h-9 w-9 rounded-full border text-sm ${
                    selectedVariant === v.id
                      ? "border-navy bg-navy text-white"
                      : "border-neutral-200 text-neutral-700"
                  }`}
                >
                  {v.size}
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-neutral-700">Quantité</p>
        <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-3 py-1">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span className="w-4 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue, réessayez.
        </p>
      )}
      {status === "done" && (
        <p className="text-sm text-green-600">Ajouté au panier ✓</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => addToCart(false)}
          disabled={status === "loading"}
          className="flex-1 rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Ajouter au panier
        </button>
        <button
          onClick={() => addToCart(true)}
          disabled={status === "loading"}
          className="flex-1 rounded-full bg-navy py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Acheter maintenant
        </button>
      </div>
    </div>
  );
}
