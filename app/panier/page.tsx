import BottomNav from "@/components/BottomNav";
import CartList from "@/components/CartList";

export default function PanierPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-28">
      <header className="sticky top-0 z-10 bg-white px-4 pb-3 pt-5">
        <h1 className="text-lg font-semibold text-navy">Mon panier</h1>
      </header>

      <CartList />

      <BottomNav />
    </main>
  );
}
