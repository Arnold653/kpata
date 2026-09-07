"use client";

import { Home, Grid2X2, ShoppingCart, Heart, User } from "lucide-react";

const items = [
  { label: "Accueil", icon: Home },
  { label: "Catégories", icon: Grid2X2 },
  { label: "Panier", icon: ShoppingCart, badge: 3 },
  { label: "Favoris", icon: Heart },
  { label: "Compte", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-white">
      <ul className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map(({ label, icon: Icon, badge }, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-1">
            <button
              className={`relative flex flex-col items-center gap-1 text-xs ${
                i === 0 ? "text-navy" : "text-neutral-400"
              }`}
            >
              <Icon size={22} strokeWidth={i === 0 ? 2.4 : 2} />
              {badge && (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-white">
                  {badge}
                </span>
              )}
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
