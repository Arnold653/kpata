"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Package, Grid2X2, ShoppingCart, Users, CreditCard,
  Truck, Tag, Ticket, Bell, FileText, BarChart3, Settings, ChevronDown,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/admin" },
  { label: "Produits", icon: Package, href: "/admin/produits", dropdown: true },
  { label: "Catégories", icon: Grid2X2, href: "/admin/categories" },
  { label: "Commandes", icon: ShoppingCart, href: "/admin/commandes" },
  { label: "Clients", icon: Users, href: "/admin/clients", dropdown: true },
  { label: "Paiements", icon: CreditCard, href: "/admin/paiements" },
  { label: "Livraisons", icon: Truck, href: "/admin/livraisons" },
  { label: "Promotions", icon: Tag, href: "/admin/promotions", dropdown: true },
  { label: "Coupons", icon: Ticket, href: "/admin/coupons", dropdown: true },
  { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { label: "Contenus", icon: FileText, href: "/admin/contenus", dropdown: true },
  { label: "Statistiques", icon: BarChart3, href: "/admin/statistiques", dropdown: true },
  { label: "Paramètres", icon: Settings, href: "/admin/parametres" },
];

export default function AdminSidebar({ pendingOrders }: { pendingOrders: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-navy">
      <div className="px-5 py-5">
        <Image
          src="/logo-horizontal-white.png"
          alt="Kpata"
          width={130}
          height={48}
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {navItems.map(({ label, icon: Icon, href, dropdown }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                active ? "bg-white text-navy" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {label === "Commandes" && pendingOrders > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  {pendingOrders}
                </span>
              )}
              {dropdown && <ChevronDown size={14} className={active ? "text-navy" : "text-white/50"} />}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-white/10 p-4">
        <p className="text-sm font-semibold text-white">Kpata</p>
        <p className="mt-1 text-xs text-white/70">
          Toujours plus proche de vos clients !
        </p>
        <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange">
          <ChevronRight size={16} className="text-white" />
        </div>
      </div>

      <p className="px-5 pb-4 text-xs text-white/40">Kpata Admin · v1.0</p>
    </aside>
  );
}
