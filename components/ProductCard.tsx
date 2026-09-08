import Link from "next/link";
import { Star } from "lucide-react";
import QuickAddButton from "@/components/QuickAddButton";

type Product = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  rating_average: number | null;
  rating_count: number | null;
  image_url?: string | null;
};

export default function ProductCard({
  product,
  showQuickAdd = false,
}: {
  product: Product;
  showQuickAdd?: boolean;
}) {
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
      <p className="line-clamp-2 text-sm font-medium text-navy">{product.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold text-navy">
          {product.price.toLocaleString("fr-FR")} FCFA
        </span>
        {hasDiscount && (
          <span className="text-xs text-neutral-400 line-through">
            {product.compare_at_price!.toLocaleString("fr-FR")}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        {product.rating_count ? (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Star size={12} className="fill-orange text-orange" />
            {product.rating_average} ({product.rating_count})
          </div>
        ) : (
          <span />
        )}
        {showQuickAdd && product.id && <QuickAddButton productId={product.id} />}
      </div>
    </Link>
  );
}
