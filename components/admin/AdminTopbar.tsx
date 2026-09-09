"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard } from "lucide-react";

const TITLES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/produits": "Produits",
  "/admin/categories": "Catégories",
  "/admin/commandes": "Commandes",
  "/admin/clients": "Clients",
  "/admin/paiements": "Paiements",
  "/admin/livraisons": "Livraisons",
  "/admin/promotions": "Promotions",
  "/admin/coupons": "Coupons",
  "/admin/notifications": "Notifications",
  "/admin/contenus": "Contenus",
  "/admin/statistiques": "Statistiques",
  "/admin/parametres": "Paramètres",
};

export default function AdminTopbar({
  fullName,
  unreadCount,
}: {
  fullName: string;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const title =
    Object.entries(TITLES).find(
      ([path]) => pathname === path || (path !== "/admin" && pathname?.startsWith(path))
    )?.[1] ?? "Tableau de bord";

  const initials = fullName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard size={18} className="text-navy" />
        <h1 className="text-lg font-bold text-navy">{title}</h1>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative" aria-label="Notifications">
          <Bell size={20} className="text-neutral-500" />
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            {initials || "A"}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-navy">{fullName}</p>
            <p className="text-xs text-neutral-400">Administrateur</p>
          </div>
          <ChevronDown size={16} className="text-neutral-400" />
        </div>
      </div>
    </header>
  );
}
