import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusLabels: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  prete: "Prête",
  expediee: "Expédiée",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
  retour: "Retour",
};

export default async function CommandesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: orders } = await supabase
    .from("orders")
    .select("order_number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Mes commandes</h1>
      </header>

      <div className="px-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Link
              key={order.order_number}
              href={`/suivi/${order.order_number}`}
              className="flex items-center justify-between border-b border-neutral-100 py-4"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {order.order_number}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")} ·{" "}
                  {statusLabels[order.status]}
                </p>
                <p className="text-sm font-semibold text-navy">
                  {order.total.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <ChevronRight size={18} className="text-neutral-300" />
            </Link>
          ))
        ) : (
          <p className="py-10 text-center text-sm text-neutral-400">
            Vous n&apos;avez pas encore passé de commande.
          </p>
        )}
      </div>
    </main>
  );
}
