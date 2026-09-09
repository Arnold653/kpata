import Link from "next/link";
import { ChevronLeft, Truck, Check, Package } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusLabels: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Commande confirmée",
  en_preparation: "Préparation en cours",
  prete: "Prête",
  expediee: "Expédiée",
  en_livraison: "En cours de livraison",
  livree: "Livré",
  annulee: "Annulée",
  retour: "Retour",
};

const timelineOrder = ["confirmee", "en_preparation", "en_livraison", "livree"];

export default async function SuiviPage({
  params,
}: {
  params: { numero: string };
}) {
  const supabase = createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, created_at, delivery_method, address:addresses(city, neighborhood, phone)"
    )
    .eq("order_number", params.numero)
    .single();

  if (!order) notFound();

  const { data: history } = await supabase
    .from("order_status_history")
    .select("status, created_at")
    .eq("order_id", order.id)
    .order("created_at");

  const currentIndex = timelineOrder.indexOf(order.status);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte/commandes">
          <ChevronLeft size={22} className="text-navy" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Suivre ma commande</h1>
      </header>

      <div className="px-4">
        <div className="rounded-card border border-neutral-200 p-4">
          <p className="text-sm font-bold text-navy">
            N° de commande : {order.order_number}
          </p>
          <p className="text-sm text-neutral-500">
            Commandé le{" "}
            {new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mt-6 space-y-0">
          {timelineOrder.map((s, i) => {
            const historyEntry = history?.find((h) => h.status === s);
            const done = i <= currentIndex;
            const isLast = i === timelineOrder.length - 1;
            return (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-400"
                    }`}
                  >
                    {done ? <Check size={16} /> : <Package size={14} />}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-px flex-1 ${done ? "bg-green-500" : "bg-neutral-200"}`}
                      style={{ minHeight: "28px" }}
                    />
                  )}
                </div>
                <div className="pb-6">
                  <p
                    className={`text-sm font-bold ${done ? "text-green-600" : "text-navy"}`}
                  >
                    {statusLabels[s]}
                  </p>
                  {historyEntry && (
                    <p className="text-xs text-neutral-500">
                      {new Date(historyEntry.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                      {" - "}
                      {new Date(historyEntry.created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {order.status === "en_livraison" && (
          <div className="rounded-card bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Truck size={28} className="text-orange" />
              <div>
                <p className="text-sm font-bold text-navy">Votre colis est en route !</p>
                <p className="text-sm text-neutral-500">
                  Il sera livré dans 1 à 2 jours.
                </p>
              </div>
            </div>
            <button className="mt-3 w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white">
              Voir sur la carte
            </button>
          </div>
        )}

        {order.delivery_method === "domicile" && (
          <div className="mt-6 border-t border-neutral-100 pt-4 text-sm">
            <h2 className="mb-2 font-bold text-navy">Détails de la livraison</h2>
            <p className="text-neutral-600">
              <span className="font-semibold text-navy">Livreur : </span>
              Kpata Express
            </p>
            <p className="text-neutral-600">
              <span className="font-semibold text-navy">Téléphone : </span>
              +229 01 97 00 00 00
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
