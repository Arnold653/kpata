import Link from "next/link";
import {
  User, Package, Heart, MapPin, CreditCard, Ticket,
  Bell, MessageCircle, Settings, Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { label: "Informations personnelles", icon: User, href: "/compte/profil" },
  { label: "Mes commandes", icon: Package, href: "/compte/commandes" },
  { label: "Mes favoris", icon: Heart, href: "/favoris" },
  { label: "Mes adresses", icon: MapPin, href: "/compte/adresses" },
  { label: "Mes moyens de paiement", icon: CreditCard, href: "/compte/paiement" },
  { label: "Mes coupons", icon: Ticket, href: "/compte/coupons" },
  { label: "Notifications", icon: Bell, href: "/compte/notifications" },
  { label: "Service client", icon: MessageCircle, href: "/aide" },
  { label: "Paramètres", icon: Settings, href: "/compte/parametres" },
  { label: "Sécurité", icon: Lock, href: "/compte/securite" },
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
      <header className="bg-navy px-4 pb-6 pt-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-semibold">
            {initials}
          </div>
          <div>
            <p className="font-semibold">{profile?.full_name || "Mon compte"}</p>
            <p className="text-sm text-white/70">{user.email}</p>
          </div>
        </div>
      </header>

      <nav className="px-4 pt-4">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 border-b border-neutral-100 py-3.5 text-sm text-neutral-800"
          >
            <Icon size={18} className="text-navy" />
            {label}
          </Link>
        ))}
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-3 border-b border-neutral-100 py-3.5 text-sm font-medium text-orange"
          >
            <Settings size={18} className="text-orange" />
            Administration
          </Link>
        )}
        <SignOutButton />
      </nav>

      <BottomNav />
    </main>
  );
}
