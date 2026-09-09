"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    price: number;
  };
  variant: { color: string | null; size: string | null } | null;
  image_url?: string | null;
};

export default function CartList() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/connexion");
      return;
    }

    const { data } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product:products(slug, name, price, product_images(url, is_primary)), variant:product_variants(color, size)"
      )
      .eq("user_id", user.id);

    const formatted = (data || []).map((row: any) => ({
      ...row,
      image_url:
        row.product?.product_images?.find((i: any) => i.is_primary)?.url ||
        row.product?.product_images?.[0]?.url,
    }));

    setItems(formatted);
  }

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id);
    await supabase.from("cart_items").update({ quantity }).eq("id", id);
    load();
  }

  async function removeItem(id: string) {
    await supabase.from("cart_items").delete().eq("id", id);
    load();
  }

  if (items === null) {
    return <p className="px-4 py-10 text-center text-sm text-neutral-400">Chargement...</p>;
  }

  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-neutral-400">
        Votre panier est vide.
      </p>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 px-4 pt-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-card border border-neutral-100 p-3"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-neutral-400">
                    {[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-1 text-sm font-bold text-navy">
                  {item.product.price.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex divide-x divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 text-navy">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Supprimer"
                  className="text-navy"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-navy">Sous-total</span>
          <span className="text-lg font-bold text-navy">
            {subtotal.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <button
          onClick={() => router.push("/commande")}
          className="w-full rounded-full bg-orange py-3.5 text-sm font-semibold text-white"
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
}
