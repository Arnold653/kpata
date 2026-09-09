"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Home, Store, Smartphone, CreditCard, Truck } from "lucide-react";
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

const steps = ["Adresse", "Paiement", "Confirmation"];

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
  const [deliveryMethod, setDeliveryMethod] = useState<"domicile" | "retrait_magasin">(
    "domicile"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "mobile_money" | "carte_bancaire" | "paiement_livraison"
  >("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const selectedAddress = addressList.find((a) => a.id === selectedAddressId);
  const matchedZone =
    zones.find(
      (z) => z.city.toLowerCase() === selectedAddress?.city.toLowerCase()
    ) ?? zones[0];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = deliveryMethod === "retrait_magasin" ? 0 : matchedZone?.base_fee ?? 0;
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
        delivery_zone_id: deliveryMethod === "domicile" ? matchedZone?.id : null,
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
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    router.push(`/commande/succes/${order.order_number}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-28">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)}>
            <ChevronLeft size={22} className="text-navy" />
          </button>
        ) : (
          <div className="w-[22px]" />
        )}
        <h1 className="text-lg font-bold text-navy">
          {step === 0 ? "Adresse" : "Paiement"}
        </h1>
      </header>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                i <= step ? "bg-navy text-white" : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-1.5 font-medium ${i <= step ? "text-navy" : "text-neutral-400"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-px flex-1 ${i < step ? "bg-navy" : "bg-neutral-200"}`} />
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
                  addressList.length > 0 ? () => setShowAddressForm(false) : undefined
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

        {/* ÉTAPE 2 — Paiement (livraison + paiement combinés) */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="mb-2 text-sm font-bold text-navy">Adresse de livraison</h2>
              <div className="flex items-center justify-between rounded-card border border-neutral-200 p-3">
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <MapPin size={16} className="text-navy" />
                  {selectedAddress?.city}, Bénin
                </div>
                <button
                  onClick={() => setStep(0)}
                  className="text-sm font-medium text-navy underline"
                >
                  Modifier
                </button>
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-navy">Mode de livraison</h2>
              <div className="space-y-2">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-card border p-3 ${
                    deliveryMethod === "domicile" ? "border-navy bg-navy/5" : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home size={18} className="text-navy" />
                    <div className="text-sm">
                      <p className="font-medium text-neutral-900">Livraison à domicile</p>
                      <p className="text-xs text-neutral-500">
                        {matchedZone
                          ? `${matchedZone.estimated_days_min}-${matchedZone.estimated_days_max} jours • ${matchedZone.base_fee.toLocaleString("fr-FR")} FCFA`
                          : "Tarif calculé selon votre ville"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "domicile"}
                    onChange={() => setDeliveryMethod("domicile")}
                  />
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-card border p-3 ${
                    deliveryMethod === "retrait_magasin" ? "border-navy bg-navy/5" : "border-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Store size={18} className="text-navy" />
                    <div className="text-sm">
                      <p className="font-medium text-neutral-900">Retrait en magasin</p>
                      <p className="text-xs text-neutral-500">Gratuit</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "retrait_magasin"}
                    onChange={() => setDeliveryMethod("retrait_magasin")}
                  />
                </label>
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-navy">Mode de paiement</h2>
              <div className="divide-y divide-neutral-100 rounded-card border border-neutral-200">
                {[
                  { id: "mobile_money", label: "Mobile Money (MTN, Moov...)", icon: Smartphone },
                  { id: "carte_bancaire", label: "Carte bancaire", icon: CreditCard },
                  { id: "paiement_livraison", label: "Paiement à la livraison", icon: Truck },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 p-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id as any)}
                    />
                    <option.icon size={18} className="text-navy" />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-sm">
              <span className="text-neutral-500">Total à payer</span>
              <span className="text-base font-bold text-navy">
                {total.toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full rounded-full bg-orange py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Validation en cours..." : "Valider la commande"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
