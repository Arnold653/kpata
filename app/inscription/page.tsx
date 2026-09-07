import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function InscriptionPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white px-6 pt-16">
      <h1 className="mb-1 text-2xl font-bold text-navy">Créer un compte</h1>
      <p className="mb-8 text-sm text-neutral-500">
        Rejoignez Kpata pour commander en toute simplicité.
      </p>

      <AuthForm mode="inscription" />

      <p className="mt-6 text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-navy">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
