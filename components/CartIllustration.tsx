import { ShoppingCart } from "lucide-react";

export default function CartIllustration() {
  return (
    <div className="relative flex h-56 w-56 items-end justify-center">
      {/* Sac bleu (arrière, centre) */}
      <div className="absolute bottom-16 h-28 w-16 rounded-xl bg-navy-light shadow-lg">
        <div className="absolute -top-3 left-1/2 h-5 w-9 -translate-x-1/2 rounded-t-full border-[3px] border-b-0 border-navy-light" />
      </div>

      {/* Sac orange (gauche) */}
      <div className="absolute bottom-14 left-4 h-24 w-16 -rotate-12 rounded-xl bg-orange shadow-lg">
        <div className="absolute -top-3 left-1/2 h-5 w-8 -translate-x-1/2 rounded-t-full border-[3px] border-b-0 border-orange" />
      </div>

      {/* Sac jaune (droite) */}
      <div className="absolute bottom-16 right-4 h-20 w-14 rotate-12 rounded-xl bg-orange-light shadow-lg">
        <div className="absolute -top-3 left-1/2 h-4 w-7 -translate-x-1/2 rounded-t-full border-[3px] border-b-0 border-orange-light" />
      </div>

      {/* Chariot */}
      <ShoppingCart
        size={104}
        strokeWidth={1.8}
        className="relative z-10 text-navy drop-shadow-md"
      />
    </div>
  );
}
