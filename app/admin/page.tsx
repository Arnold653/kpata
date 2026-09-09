import Link from "next/link";
import {
  DollarSign, ShoppingCart, UserPlus, Package, TrendingUp as SalesIcon,
  ShoppingBag, AlertTriangle, UserCheck, Truck as TruckIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/admin/StatCard";
import SalesEvolutionChart from "@/components/admin/SalesEvolutionChart";
import OrdersStatusDonut from "@/components/admin/OrdersStatusDonut";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function daysAgo(n: number) {
  const x = new Date();
  x.setDate(x.getDate() - n);
  return startOfDay(x);
}
function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  nouvelle: { label: "Nouvelle", color: "#94A3B8" },
  confirmee: { label: "Confirmée", color: "#3B82F6" },
  en_preparation: { label: "En préparation", color: "#F59E0B" },
  prete: { label: "Prête", color: "#8B5CF6" },
  expediee: { label: "Expédiée", color: "#8B5CF6" },
  en_livraison: { label: "En livraison", color: "#10B981" },
  livree: { label: "Livrée", color: "#22C55E" },
  annulee: { label: "Annulée", color: "#EF4444" },
  retour: { label: "Retour", color: "#EF4444" },
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { periode?: string };
}) {
  const supabase = createClient();
  const periode = searchParams.periode || "7j";

  const [{ data: orders }, { data: profiles }, { data: orderItems }, { data: products }] =
    await Promise.all([
      supabase.from("orders").select("id, order_number, total, status, created_at, user_id, customer:profiles(full_name)"),
      supabase.from("profiles").select("id, created_at, role"),
      supabase.from("order_items").select("product_name, quantity, product_id"),
      supabase.from("products").select("id, name, stock_available, stock_alert_threshold, is_published, product_images(url, is_primary)"),
    ]);

  const allOrders = orders || [];
  const allProfiles = (profiles || []).filter((p) => p.role === "client");
  const now = new Date();

  const ranges: Record<string, { start: Date | null; prevStart: Date | null; prevEnd: Date | null }> = {
    aujourdhui: { start: startOfDay(now), prevStart: daysAgo(1), prevEnd: startOfDay(now) },
    "7j": { start: daysAgo(7), prevStart: daysAgo(14), prevEnd: daysAgo(7) },
    "30j": { start: daysAgo(30), prevStart: daysAgo(60), prevEnd: daysAgo(30) },
    tout: { start: null, prevStart: null, prevEnd: null },
  };
  const { start, prevStart, prevEnd } = ranges[periode] ?? ranges["7j"];

  const inRange = (date: string, from: Date | null, to?: Date | null) => {
    const d = new Date(date);
    if (from && d < from) return false;
    if (to && d >= to) return false;
    return true;
  };

  const currentOrders = start ? allOrders.filter((o) => inRange(o.created_at, start)) : allOrders;
  const previousOrders = prevStart ? allOrders.filter((o) => inRange(o.created_at, prevStart, prevEnd)) : [];
  const currentClients = start ? allProfiles.filter((p) => inRange(p.created_at, start)) : allProfiles;
  const previousClients = prevStart ? allProfiles.filter((p) => inRange(p.created_at, prevStart, prevEnd)) : [];

  const revenue = currentOrders.reduce((s, o) => s + Number(o.total), 0);
  const prevRevenue = previousOrders.reduce((s, o) => s + Number(o.total), 0);
  const ordersCount = currentOrders.length;
  const prevOrdersCount = previousOrders.length;
  const newClients = currentClients.length;
  const prevNewClients = previousClients.length;

  const unitsSold = (orderItems || []).reduce((s: number, oi: any) => s + oi.quantity, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const salesMonth = allOrders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((s, o) => s + Number(o.total), 0);

  const days = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));
  const dayLabels = days.map((d) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }));
  const dailyRevenue = days.map((d, i) => {
    const next = i < 6 ? days[i + 1] : new Date();
    return allOrders.filter((o) => inRange(o.created_at, d, next)).reduce((s, o) => s + Number(o.total), 0);
  });
  const dailyOrders = days.map((d, i) => {
    const next = i < 6 ? days[i + 1] : new Date();
    return allOrders.filter((o) => inRange(o.created_at, d, next)).length;
  });
  const dailyClients = days.map((d, i) => {
    const next = i < 6 ? days[i + 1] : new Date();
    return allProfiles.filter((p) => inRange(p.created_at, d, next)).length;
  });

  const salesChartData = dayLabels.map((label, i) => ({ label, total: dailyRevenue[i] }));

  const statusCounts = Object.keys(STATUS_META).reduce((acc, s) => {
    acc[s] = allOrders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);
  const donutData = Object.entries(STATUS_META)
    .map(([status, meta]) => ({ status, label: meta.label, color: meta.color, count: statusCounts[status] || 0 }))
    .filter((d) => d.count > 0);

  const salesByProduct = new Map<string, number>();
  (orderItems || []).forEach((oi: any) => {
    salesByProduct.set(oi.product_name, (salesByProduct.get(oi.product_name) || 0) + oi.quantity);
  });
  const topProducts = Array.from(salesByProduct.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const productImageMap = new Map(
    (products || []).map((p) => [
      p.name,
      p.product_images?.find((i: any) => i.is_primary)?.url || p.product_images?.[0]?.url,
    ])
  );

  const lowStock = (products || [])
    .filter((p) => p.is_published && p.stock_available <= (p.stock_alert_threshold ?? 5))
    .slice(0, 5);

  const activity = [
    ...allOrders.map((o) => ({
      type: "order" as const,
      label: `Nouvelle commande #${o.order_number}`,
      detail: `Client : ${(o.customer as any)?.full_name || "—"} — ${Number(o.total).toLocaleString("fr-FR")} FCFA`,
      date: new Date(o.created_at),
    })),
    ...allProfiles.map((p) => ({
      type: "client" as const,
      label: "Nouveau client inscrit",
      detail: "",
      date: new Date(p.created_at),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

  function timeAgo(date: Date) {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "à l'instant";
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h`;
    return `${Math.floor(hours / 24)} j`;
  }

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const periodeLinks = [
    { key: "aujourdhui", label: "Aujourd'hui" },
    { key: "7j", label: "7 derniers jours" },
    { key: "30j", label: "30 derniers jours" },
    { key: "tout", label: "Toutes les périodes" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Bonjour ! 👋</h2>
          <p className="text-sm text-neutral-500">
            Voici un aperçu de l&apos;activité de votre boutique.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-neutral-200 bg-white p-1 text-xs">
          {periodeLinks.map((p) => (
            <Link
              key={p.key}
              href={`/admin?periode=${p.key}`}
              className={`rounded-full px-3 py-1.5 font-medium ${
                periode === p.key ? "bg-navy text-white" : "text-neutral-500"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={DollarSign} iconBg="bg-blue-50" iconColor="text-blue-600" label="Chiffre d'affaires" value={`${revenue.toLocaleString("fr-FR")} FCFA`} changePct={pctChange(revenue, prevRevenue)} sparkline={dailyRevenue} sparklineColor="#2563EB" />
        <StatCard icon={ShoppingCart} iconBg="bg-orange-50" iconColor="text-orange" label="Commandes" value={String(ordersCount)} changePct={pctChange(ordersCount, prevOrdersCount)} sparkline={dailyOrders} sparklineColor="#F97316" />
        <StatCard icon={UserPlus} iconBg="bg-green-50" iconColor="text-green-600" label="Nouveaux clients" value={String(newClients)} changePct={pctChange(newClients, prevNewClients)} sparkline={dailyClients} sparklineColor="#16A34A" />
        <StatCard icon={Package} iconBg="bg-purple-50" iconColor="text-purple-600" label="Produits vendus" value={String(unitsSold)} changePct={null} sparkline={dailyOrders} sparklineColor="#9333EA" />
        <StatCard icon={SalesIcon} iconBg="bg-pink-50" iconColor="text-pink-600" label="Ventes du mois" value={`${salesMonth.toLocaleString("fr-FR")} FCFA`} changePct={null} sparkline={dailyRevenue} sparklineColor="#DB2777" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h3 className="mb-3 text-base font-bold text-navy">Évolution des ventes</h3>
          <SalesEvolutionChart data={salesChartData} />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="mb-4 text-base font-bold text-navy">Commandes par statut</h3>
          {donutData.length > 0 ? (
            <OrdersStatusDonut data={donutData} total={allOrders.length} />
          ) : (
            <p className="py-8 text-center text-sm text-neutral-400">Aucune commande.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="mb-3 text-base font-bold text-navy">Activité récente</h3>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  {a.type === "order" ? <ShoppingBag size={15} className="text-blue-600" /> : <UserCheck size={15} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">{a.label}</p>
                  {a.detail && <p className="text-xs text-neutral-500">{a.detail}</p>}
                </div>
                <span className="shrink-0 text-xs text-neutral-400">{timeAgo(a.date)}</span>
              </div>
            ))}
            {activity.length === 0 && <p className="py-4 text-center text-sm text-neutral-400">Aucune activité récente.</p>}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-navy p-5 text-white">
          <div className="flex items-center gap-2">
            <TruckIcon size={20} />
            <h3 className="text-base font-bold">Livraison partout au Bénin</h3>
          </div>
          <p className="mt-2 text-sm text-white/70">Vos commandes, partout, à votre porte !</p>
          <Link href="/admin/livraisons" className="mt-4 rounded-full bg-white py-2.5 text-center text-sm font-semibold text-navy">
            Voir les zones de livraison
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy">
              <AlertTriangle size={16} className="text-orange" />
              Stock faible
            </h3>
            <Link href="/admin/produits" className="text-xs font-medium text-navy">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-neutral-700">{p.name}</span>
                <span className="shrink-0 font-semibold text-orange">{p.stock_available} en stock</span>
              </div>
            ))}
            {lowStock.length === 0 && <p className="py-4 text-center text-sm text-neutral-400">Aucune alerte de stock.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">Dernières commandes</h3>
            <Link href="/admin/commandes" className="text-xs font-medium text-navy">Voir tout</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
                <th className="pb-2 font-medium">N° commande</th>
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium">Montant</th>
                <th className="pb-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-50">
                  <td className="py-2.5 font-medium text-navy">{o.order_number}</td>
                  <td className="py-2.5 text-neutral-600">{(o.customer as any)?.full_name || "—"}</td>
                  <td className="py-2.5 text-neutral-600">{Number(o.total).toLocaleString("fr-FR")} FCFA</td>
                  <td className="py-2.5">
                    <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${STATUS_META[o.status]?.color}1A`, color: STATUS_META[o.status]?.color }}>
                      {STATUS_META[o.status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-neutral-400">Aucune commande.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">Produits les plus vendus</h3>
            <Link href="/admin/produits" className="text-xs font-medium text-navy">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map(([name, qty], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">{i + 1}</span>
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {productImageMap.get(name) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={productImageMap.get(name)} alt={name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy">{name}</p>
                  <p className="text-xs text-neutral-400">{qty} ventes</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="py-4 text-center text-sm text-neutral-400">Aucune vente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
