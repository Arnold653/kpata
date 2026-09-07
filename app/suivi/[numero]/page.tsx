import Link from "next/link";
import { ChevronLeft, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusLabels: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Commande confirmée",
  en_preparation: "Préparation en cours",
  prete: "Prête",
  expediee: "Expédiée",
  en_livraison: "En cours de livraison",
  livree: "Livrée",
  annulee: "Annulée",
  retour: "Retour",
};

const timelineOrder = [
  "confirmee",
  "en_preparation",
  "en_livraison",
  "livree",
];

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
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Suivre ma commande</h1>
      </header>

      <div className="px-4">
        <p className="text-sm text-neutral-500">
          N° de commande :{" "}
          <span className="font-semibold text-neutral-900">
            {order.order_number}
          </span>
        </p>
        <p className="text-xs text-neutral-400">
          Commandé le{" "}
          {new Date(order.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-6 space-y-4">
          {timelineOrder.map((s, i) => {
            const historyEntry = history?.find((h) => h.status === s);
            const done = i <= currentIndex;
            return (
              <div key={s} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    done ? "bg-green-500 text-white" : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {done ? "✓" : ""}
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      done ? "font-medium text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {statusLabels[s]}
                  </p>
                  {historyEntry && (
                    <p className="text-xs text-neutral-400">
                      {new Date(historyEntry.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
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
          <div className="mt-6 flex items-center gap-3 rounded-card bg-navy/5 p-4">
            <Truck size={22} className="text-navy" />
            <p className="text-sm text-navy">
              Votre colis est en route ! Livraison estimée sous 1 à 2 jours.
            </p>
          </div>
        )}

        {order.address && (
          <div className="mt-6 border-t border-neutral-100 pt-4 text-sm">
            <h2 className="mb-1 font-semibold text-neutral-900">
              Détails de la livraison
            </h2>
            <p className="text-neutral-500">
              {(order.address as any).neighborhood}, {(order.address as any).city}
            </p>
            <p className="text-neutral-500">
              Téléphone : {(order.address as any).phone}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
