import { Search, MapPin, Bell, ShoppingCart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const categories = [
  { name: "Électronique", icon: "📱" },
  { name: "Mode", icon: "👗" },
  { name: "Maison", icon: "🏠" },
  { name: "Beauté", icon: "💄" },
  { name: "Sport", icon: "🏋️" },
  { name: "Plus", icon: "➕" },
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      {/* En-tête */}
      <header className="sticky top-0 z-10 bg-navy px-4 pb-4 pt-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Kpata</span>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications">
              <Bell size={22} />
            </button>
            <button aria-label="Panier" className="relative">
              <ShoppingCart size={22} />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold">
                3
              </span>
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1 text-xs text-white/80">
          <MapPin size={14} />
          <span>Cotonou, Bénin</span>
        </div>

        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-neutral-500">
          <Search size={18} />
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </label>
      </header>

      {/* Bannière principale */}
      <section className="px-4 pt-4">
        <div className="rounded-card bg-orange px-5 py-6 text-white">
          <p className="text-lg font-semibold leading-snug">
            Des produits de qualité à prix accessibles
          </p>
          <button className="mt-3 rounded-full bg-navy px-4 py-2 text-sm font-medium">
            Découvrir
          </button>
        </div>
      </section>

      {/* Catégories */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-base font-semibold text-neutral-900">
          Catégories
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center gap-2 rounded-card border border-neutral-100 bg-neutral-50 py-4"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-neutral-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Offres du moment */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">
            Offres du moment
          </h2>
          <button className="text-xs font-medium text-navy">Voir tout</button>
        </div>
        <p className="rounded-card border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
          Les produits s&apos;afficheront ici dès que la base Supabase sera
          connectée.
        </p>
      </section>

      <BottomNav />
    </main>
  );
}
