import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function ConnexionPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white px-6 pt-16">
      <h1 className="mb-1 text-2xl font-bold text-navy">Se connecter</h1>
      <p className="mb-8 text-sm text-neutral-500">
        Accédez à vos commandes, favoris et adresses.
      </p>

      <AuthForm mode="connexion" />

      <p className="mt-6 text-center text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-navy">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
