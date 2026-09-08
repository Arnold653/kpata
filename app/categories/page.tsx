import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";

const CATEGORY_IMAGES = new Set([
  "telephones-electronique", "mode-vetements", "meubles-decoration",
  "beaute-soins", "sport-loisirs", "produits-du-quotidien", "jouets",
]);

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug, icon")
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white px-4 pb-3 pt-5">
        <h1 className="mb-3 text-xl font-bold text-navy">Catégories</h1>
        <form action="/recherche" method="GET">
          <label className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-neutral-500">
            <Search size={18} />
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
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-50 text-xl">
              {CATEGORY_IMAGES.has(cat.slug) ? (
                <Image
                  src={`/categories/${cat.slug}.png`}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                />
              ) : (
                cat.icon
              )}
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
