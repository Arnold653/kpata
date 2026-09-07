import Link from "next/link";
import { Star } from "lucide-react";

type Product = {
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  rating_average: number | null;
  rating_count: number | null;
  image_url?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="block rounded-card border border-neutral-100 p-3"
    >
      <div className="mb-2 aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="line-clamp-2 text-sm text-neutral-800">{product.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-navy">
          {product.price.toLocaleString("fr-FR")} FCFA
        </span>
        {hasDiscount && (
          <span className="text-xs text-neutral-400 line-through">
            {product.compare_at_price!.toLocaleString("fr-FR")}
          </span>
        )}
      </div>
      {product.rating_count ? (
        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
          <Star size={12} className="fill-orange text-orange" />
          {product.rating_average} ({product.rating_count})
        </div>
      ) : null}
    </Link>
  );
}
