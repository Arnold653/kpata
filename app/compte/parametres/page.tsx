import Link from "next/link";
import { ChevronLeft, Lock, Bell, Ticket, User } from "lucide-react";

const items = [
  { label: "Informations personnelles", icon: User, href: "/compte/profil" },
  { label: "Sécurité", icon: Lock, href: "/compte/securite" },
  { label: "Notifications", icon: Bell, href: "/compte/notifications" },
  { label: "Mes coupons", icon: Ticket, href: "/compte/coupons" },
];

export default function ParametresPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} className="text-navy" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Paramètres</h1>
      </header>

      <nav className="px-4">
        {items.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 border-b border-neutral-100 py-3.5 text-sm font-medium text-navy"
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <span className="text-neutral-300">›</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
