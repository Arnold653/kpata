import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/accueil");

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-navy px-4 py-3 text-white">
        <span className="font-bold">Kpata — Admin</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/produits">Produits</Link>
          <Link href="/admin/commandes">Commandes</Link>
        </nav>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
    </div>
  );
}
