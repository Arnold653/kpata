import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Informations personnelles</h1>
      </header>
      <div className="px-4">
        <p className="mb-4 text-sm text-neutral-500">{user.email}</p>
        <ProfileForm
          initialFullName={profile?.full_name || ""}
          initialPhone={profile?.phone || ""}
        />
      </div>
    </main>
  );
}
