import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/accueil");

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in("status", ["nouvelle", "confirmee", "en_preparation"]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar pendingOrders={pendingOrders ?? 0} />
      <div className="pl-64">
        <AdminTopbar fullName={profile?.full_name || "Admin"} unreadCount={3} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
