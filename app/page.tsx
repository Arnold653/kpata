import Link from "next/link";
import Image from "next/image";
import CartIllustration from "@/components/CartIllustration";

export default function WelcomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-white">
      {/* Contenu haut : logo, tagline, illustration */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 pb-32 pt-16 text-center">
        <Image
          src="/logo-horizontal.png"
          alt="Kpata"
          width={220}
          height={82}
          priority
          className="h-14 w-auto"
        />

        <p className="text-xl font-bold leading-snug text-orange">
          Tout ce dont vous avez besoin,
          <br />
          au même endroit.
        </p>

        <CartIllustration />
      </div>

      {/* Vague + zone navy avec les boutons */}
      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
          className="block h-12 w-full"
        >
          <path d="M0,40 C120,0 280,60 400,15 L400,60 L0,60 Z" fill="#003B7A" />
        </svg>
        <div className="-mt-px space-y-4 bg-navy px-8 pb-10 pt-2">
          <Link
            href="/accueil"
            className="block rounded-full bg-orange py-3.5 text-center text-sm font-semibold text-white"
          >
            Commencer
          </Link>
          <Link
            href="/connexion"
            className="block text-center text-sm font-medium text-white"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
