import { createClient } from "@/lib/supabase/server";

export default async function AdminClientsPage() {
  const supabase = createClient();
  const { data: clients, error } = await supabase.rpc("admin_list_clients");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Clients</h1>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 font-medium">Commandes</th>
              <th className="px-4 py-3 font-medium">Total dépensé</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((c: any) => (
              <tr key={c.id} className="border-b border-neutral-50">
                <td className="px-4 py-3 font-medium text-navy">{c.full_name || "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{c.email}</td>
                <td className="px-4 py-3 text-neutral-600">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(c.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-neutral-600">{c.orders_count}</td>
                <td className="px-4 py-3 font-medium text-navy">
                  {Number(c.total_spent).toLocaleString("fr-FR")} FCFA
                </td>
              </tr>
            ))}
            {(!clients || clients.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  {error ? "Impossible de charger les clients." : "Aucun client pour le moment."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
