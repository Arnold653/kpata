import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

const CATEGORY_IMAGES = new Set([
  "telephones-electronique", "mode-vetements", "meubles-decoration",
  "beaute-soins", "sport-loisirs", "produits-du-quotidien", "jouets",
]);

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "telephones-electronique": "Téléphones, TV, ordinateurs...",
  "informatique": "Ordinateurs, accessoires, périphériques...",
  "mode-vetements": "Vêtements, chaussures, accessoires...",
  "chaussures": "Sneakers, sandales, chaussures de ville...",
  "sacs-accessoires": "Sacs, bijoux, accessoires de mode...",
  "maison": "Meubles, cuisine, décoration...",
  "cuisine": "Ustensiles, électroménager, vaisselle...",
  "meubles-decoration": "Meubles, luminaires, décoration...",
  "beaute-soins": "Soins, maquillage, parfum...",
  "bebe-enfants": "Jouets, vêtements, accessoires...",
  "jouets": "Jouets, jeux, loisirs créatifs...",
  "sport-loisirs": "Équipements, outdoor...",
  "produits-du-quotidien": "Alimentation, hygiène, ménage...",
  "cadeaux": "Idées cadeaux pour toutes occasions...",
  "livres": "Romans, BD, scolaire...",
  "auto-moto": "Accessoires auto, moto, entretien...",
  "animaux": "Alimentation, accessoires pour animaux...",
  "autres": "Divers et bonnes affaires...",
};

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug, icon")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("display_order");

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white px-4 pb-3 pt-5">
        <h1 className="mb-3 text-2xl font-extrabold text-navy">Catégories</h1>
        <form action="/recherche" method="GET">
          <label className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5">
            <Search size={18} className="text-navy" />
            <input
              type="text"
              name="q"
              placeholder="Rechercher une catégorie..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </label>
        </form>
      </header>

      <div className="flex flex-col px-4">
        {categories?.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex items-center gap-4 border-b border-neutral-100 py-4"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-2xl">
              {CATEGORY_IMAGES.has(cat.slug) ? (
                <Image
                  src={`/categories/${cat.slug}.png`}
                  alt={cat.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              ) : (
                cat.icon
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{cat.name}</p>
              <p className="truncate text-sm text-neutral-400">
                {CATEGORY_DESCRIPTIONS[cat.slug] ?? ""}
              </p>
            </div>
            <ChevronRight size={20} className="shrink-0 text-navy" />
          </Link>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
