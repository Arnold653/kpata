import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CommandeSuccesPage({
  params,
}: {
  params: { numero: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <CheckCircle2 size={56} className="text-green-500" />
      <h1 className="text-xl font-bold text-navy">Commande confirmée !</h1>
      <p className="text-sm text-neutral-500">
        Votre commande{" "}
        <span className="font-semibold text-neutral-800">{params.numero}</span>{" "}
        a bien été enregistrée. Vous recevrez une notification à chaque étape.
      </p>
      <div className="mt-4 flex w-full flex-col gap-3">
        <Link
          href={`/suivi/${params.numero}`}
          className="rounded-full bg-navy py-3 text-sm font-semibold text-white"
        >
          Suivre ma commande
        </Link>
        <Link
          href="/accueil"
          className="rounded-full border border-neutral-200 py-3 text-sm font-medium text-neutral-700"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
