import { createClient } from "@/lib/supabase/server";

export default async function AdminNotificationsPage() {
  const supabase = createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, type, created_at, user:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">Notifications envoyées</h1>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        {notifications?.map((n) => (
          <div key={n.id} className="flex items-start justify-between border-b border-neutral-100 px-4 py-3 last:border-0">
            <div>
              <p className="text-sm font-medium text-navy">{n.title}</p>
              <p className="text-xs text-neutral-500">{n.body}</p>
              <p className="text-xs text-neutral-400">
                Destinataire : {(n.user as any)?.full_name || "—"}
              </p>
            </div>
            <span className="shrink-0 text-xs text-neutral-400">
              {new Date(n.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        {(!notifications || notifications.length === 0) && (
          <p className="px-4 py-8 text-center text-neutral-400">Aucune notification envoyée.</p>
        )}
      </div>
    </div>
  );
}
