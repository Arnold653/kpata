"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, ShoppingCart, Heart, User } from "lucide-react";

const items = [
  { label: "Accueil", icon: Home, href: "/" },
  { label: "Catégories", icon: Grid2X2, href: "/categories" },
  { label: "Panier", icon: ShoppingCart, href: "/panier" },
  { label: "Favoris", icon: Heart, href: "/favoris" },
  { label: "Compte", icon: User, href: "/compte" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-white">
      <ul className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map(({ label, icon: Icon, href }) => {
          const active =
            href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <li key={label} className="flex flex-1 flex-col items-center">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 text-xs ${
                  active ? "text-navy" : "text-neutral-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
