import { createClient } from "@/lib/supabase/server";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-navy">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: orders }, { count: newCustomers }, { data: products }] =
    await Promise.all([
      supabase.from("orders").select("total, status, created_at"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString()),
      supabase
        .from("products")
        .select("id, name, stock_available, stock_alert_threshold, is_published"),
    ]);

  const allOrders = orders || [];
  const revenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const salesToday = allOrders
    .filter((o) => new Date(o.created_at) >= startOfToday)
    .reduce((sum, o) => sum + Number(o.total), 0);
  const salesMonth = allOrders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = allOrders.filter((o) =>
    ["nouvelle", "confirmee", "en_preparation"].includes(o.status)
  ).length;
  const inDelivery = allOrders.filter((o) => o.status === "en_livraison").length;
  const lowStock = (products || []).filter(
    (p) => p.is_published && p.stock_available <= (p.stock_alert_threshold ?? 5)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Chiffre d'affaires" value={`${revenue.toLocaleString("fr-FR")} FCFA`} />
        <StatCard label="Ventes du jour" value={`${salesToday.toLocaleString("fr-FR")} FCFA`} />
        <StatCard label="Ventes du mois" value={`${salesMonth.toLocaleString("fr-FR")} FCFA`} />
        <StatCard label="Commandes totales" value={allOrders.length} />
        <StatCard label="Commandes en attente" value={pendingOrders} />
        <StatCard label="En livraison" value={inDelivery} />
        <StatCard label="Nouveaux clients (mois)" value={newCustomers ?? 0} />
        <StatCard label="Produits en stock faible" value={lowStock.length} />
      </div>

      {lowStock.length > 0 && (
        <div className="rounded-card border border-orange/30 bg-orange/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-orange-dark">
            ⚠️ Stock faible
          </h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            {lowStock.map((p) => (
              <li key={p.id}>
                {p.name} — {p.stock_available} restant(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
