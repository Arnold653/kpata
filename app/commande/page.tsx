import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutWizard from "@/components/CheckoutWizard";

export default async function CommandePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const [{ data: addresses }, { data: zones }, { data: cartItems }] =
    await Promise.all([
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false }),
      supabase
        .from("delivery_zones")
        .select("*")
        .eq("is_active", true)
        .order("base_fee"),
      supabase
        .from("cart_items")
        .select(
          "id, quantity, product_id, variant_id, product:products(name, price), variant:product_variants(color, size)"
        )
        .eq("user_id", user.id),
    ]);

  if (!cartItems || cartItems.length === 0) redirect("/panier");

  return (
    <CheckoutWizard
      addresses={addresses || []}
      zones={zones || []}
      cartItems={cartItems as any}
    />
  );
}
