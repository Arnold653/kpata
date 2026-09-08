import Link from "next/link";
import { ChevronLeft, Bell } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarkNotificationsRead from "@/components/MarkNotificationsRead";

export default async function NotificationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const unreadIds = (notifications || [])
    .filter((n) => !n.is_read)
    .map((n) => n.id);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <MarkNotificationsRead ids={unreadIds} />

      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Notifications</h1>
      </header>

      <div className="px-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 border-b border-neutral-100 py-4 ${
                !n.is_read ? "bg-orange/5" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10">
                <Bell size={16} className="text-navy" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                <p className="text-sm text-neutral-500">{n.body}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(n.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-10 text-center text-sm text-neutral-400">
            Aucune notification pour le moment.
          </p>
        )}
      </div>
    </main>
  );
}
