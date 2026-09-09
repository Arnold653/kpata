import Link from "next/link";
import {
  ClipboardList, MapPin, CreditCard, Heart, Headphones, Settings, ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { label: "Mes commandes", icon: ClipboardList, href: "/compte/commandes" },
  { label: "Mes adresses", icon: MapPin, href: "/compte/adresses" },
  { label: "Mes moyens de paiement", icon: CreditCard, href: "/compte/paiement" },
  { label: "Mes favoris", icon: Heart, href: "/favoris" },
  { label: "Service client", icon: Headphones, href: "/aide" },
  { label: "Paramètres", icon: Settings, href: "/compte/parametres" },
];

export default async function ComptePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-white px-6 pb-24 text-center">
        <p className="text-lg font-semibold text-navy">
          Connectez-vous pour accéder à votre compte
        </p>
        <Link
          href="/connexion"
          className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white"
        >
          Se connecter
        </Link>
        <BottomNav />
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const initials = (profile?.full_name || user.email || "?")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <div className="px-4 pb-2 pt-6">
        <Link href="/compte/profil" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="font-bold text-navy">{profile?.full_name || "Mon compte"}</p>
            <p className="text-sm text-blue-500">{user.email}</p>
          </div>
        </Link>
      </div>

      <nav className="px-4 pt-4">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-card border border-neutral-100 px-3 py-3.5 mb-2 text-sm font-medium text-navy"
          >
            <Icon size={19} className="text-navy" />
            <span className="flex-1">{label}</span>
            <span className="text-neutral-300">›</span>
          </Link>
        ))}
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="mb-2 flex items-center gap-3 rounded-card border border-orange/30 bg-orange/5 px-3 py-3.5 text-sm font-medium text-orange"
          >
            <ShieldCheck size={19} className="text-orange" />
            <span className="flex-1">Administration</span>
            <span className="text-orange/50">›</span>
          </Link>
        )}
      </nav>

      <div className="px-4 pt-2">
        <SignOutButton />
      </div>

      <BottomNav />
    </main>
  );
}
