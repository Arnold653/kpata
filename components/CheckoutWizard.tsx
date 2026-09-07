"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

type Zone = {
  id: string;
  city: string;
  base_fee: number;
  estimated_days_min: number;
  estimated_days_max: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  variant_id: string | null;
  product: { name: string; price: number };
  variant: { color: string | null; size: string | null } | null;
};

const steps = ["Adresse", "Livraison", "Paiement", "Confirmation"];

export default function CheckoutWizard({
  addresses,
  zones,
  cartItems,
}: {
  addresses: Address[];
  zones: Zone[];
  cartItems: CartItem[];
}) {
  const [step, setStep] = useState(0);
  const [addressList, setAddressList] = useState(addresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses[0]?.id ?? null
  );
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [deliveryMethod, setDeliveryMethod] = useState<
    "domicile" | "point_relais" | "retrait_magasin"
  >("domicile");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "mobile_money" | "carte_bancaire" | "paiement_livraison"
  >("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const deliveryFee =
    deliveryMethod === "retrait_magasin" ? 0 : selectedZone?.base_fee ?? 0;
  const total = subtotal + deliveryFee;

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !selectedAddressId) {
      setError("Informations manquantes.");
      setSubmitting(false);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address_id: selectedAddressId,
        delivery_method: deliveryMethod,
        delivery_zone_id: selectedZoneId,
        delivery_fee: deliveryFee,
        payment_method: paymentMethod,
        subtotal,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      setError("La commande n'a pas pu être créée. Réessayez.");
      setSubmitting(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity,
      line_total: item.product.price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    router.push(`/commande/succes/${order.order_number}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-28">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)}>
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div className="w-[22px]" />
        )}
        <h1 className="text-lg font-semibold text-navy">Commande</h1>
      </header>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                i <= step ? "bg-navy text-white" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-1.5 ${i <= step ? "text-navy" : "text-neutral-400"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="mx-1 h-px flex-1 bg-neutral-200" />
            )}
          </div>
        ))}
      </div>

      <div className="px-4">
        {/* ÉTAPE 1 — Adresse */}
        {step === 0 && (
          <div className="space-y-3">
            {addressList.map((addr) => (
              <label
                key={addr.id}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-3 ${
                  selectedAddressId === addr.id
                    ? "border-navy bg-navy/5"
                    : "border-neutral-200"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium text-neutral-900">
                    {addr.full_name} — {addr.phone}
                  </p>
                  <p className="text-neutral-500">
                    {[addr.neighborhood, addr.city].filter(Boolean).join(", ")}
                  </p>
                  {addr.landmark && (
                    <p className="text-xs text-neutral-400">{addr.landmark}</p>
                  )}
                </div>
              </label>
            ))}

            {showAddressForm ? (
              <AddressForm
                onSaved={(addr) => {
                  setAddressList((prev) => [...prev, addr]);
                  setSelectedAddressId(addr.id);
                  setShowAddressForm(false);
                }}
                onCancel={
                  addressList.length > 0
                    ? () => setShowAddressForm(false)
                    : undefined
                }
              />
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full rounded-full border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-navy"
              >
                + Ajouter une nouvelle adresse
              </button>
            )}

            <button
              disabled={!selectedAddressId}
              onClick={() => setStep(1)}
              className="mt-4 w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continuer
            </button>
          </div>
        )}

        {/* ÉTAPE 2 — Livraison */}
        {step === 1 && (
          <div className="space-y-3">
            {[
              { id: "domicile", label: "Livraison à domicile" },
              { id: "point_relais", label: "Point relais" },
              { id: "retrait_magasin", label: "Retrait en magasin" },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-card border p-3 text-sm ${
                  deliveryMethod === option.id
                    ? "border-navy bg-navy/5"
                    : "border-neutral-200"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === option.id}
                  onChange={() => setDeliveryMethod(option.id as any)}
                />
                {option.label}
              </label>
            ))}

            {deliveryMethod !== "retrait_magasin" && (
              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Votre ville
                </p>
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <label
                      key={zone.id}
                      className={`flex cursor-pointer items-center justify-between rounded-card border p-3 text-sm ${
                        selectedZoneId === zone.id
                          ? "border-navy bg-navy/5"
                          : "border-neutral-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="zone"
                          checked={selectedZoneId === zone.id}
                          onChange={() => setSelectedZoneId(zone.id)}
                        />
                        {zone.city}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {zone.base_fee.toLocaleString("fr-FR")} FCFA ·{" "}
                        {zone.estimated_days_min}-{zone.estimated_days_max}j
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={deliveryMethod !== "retrait_magasin" && !selectedZoneId}
              onClick={() => setStep(2)}
              className="mt-4 w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continuer
            </button>
          </div>
        )}

        {/* ÉTAPE 3 — Paiement */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              { id: "mobile_money", label: "Mobile Money (MTN, Moov...)" },
              { id: "carte_bancaire", label: "Carte bancaire" },
              { id: "paiement_livraison", label: "Paiement à la livraison" },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-card border p-3 text-sm ${
                  paymentMethod === option.id
                    ? "border-navy bg-navy/5"
                    : "border-neutral-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id as any)}
                />
                {option.label}
              </label>
            ))}

            <button
              onClick={() => setStep(3)}
              className="mt-4 w-full rounded-full bg-orange py-3 text-sm font-semibold text-white"
            >
              Continuer
            </button>
          </div>
        )}

        {/* ÉTAPE 4 — Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-card border border-neutral-100 p-4 text-sm">
              <h2 className="mb-2 font-semibold text-neutral-900">Résumé</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-1 text-neutral-600">
                  <span>
                    {item.quantity} × {item.product.name}
                  </span>
                  <span>
                    {(item.product.price * item.quantity).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              ))}
              <div className="mt-2 space-y-1 border-t border-neutral-100 pt-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison</span>
                  <span>{deliveryFee.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between font-semibold text-navy">
                  <span>Total</span>
                  <span>{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full rounded-full bg-orange py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Confirmation en cours..." : "Confirmer ma commande"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
