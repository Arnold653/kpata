import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddressManager from "@/components/AddressManager";

export default async function AdressesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Mes adresses</h1>
      </header>

      <div className="px-4">
        <AddressManager initialAddresses={addresses || []} />
      </div>
    </main>
  );
}
