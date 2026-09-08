import Link from "next/link";
import { ChevronLeft, MessageCircle, Phone, Mail } from "lucide-react";

export default function AidePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-navy">Besoin d&apos;aide ?</h1>
      </header>

      <div className="space-y-3 px-4">
        <a
          href="https://wa.me/22901000000"
          target="_blank"
          className="flex items-center gap-3 rounded-card border border-neutral-100 p-4"
        >
          <MessageCircle size={20} className="text-green-600" />
          <div>
            <p className="text-sm font-medium text-neutral-900">WhatsApp</p>
            <p className="text-xs text-neutral-500">Réponse rapide, 7j/7</p>
          </div>
        </a>

        <a
          href="tel:+22901000000"
          className="flex items-center gap-3 rounded-card border border-neutral-100 p-4"
        >
          <Phone size={20} className="text-navy" />
          <div>
            <p className="text-sm font-medium text-neutral-900">Appel téléphonique</p>
            <p className="text-xs text-neutral-500">+229 01 00 00 00</p>
          </div>
        </a>

        <a
          href="mailto:contact@kpata.bj"
          className="flex items-center gap-3 rounded-card border border-neutral-100 p-4"
        >
          <Mail size={20} className="text-orange" />
          <div>
            <p className="text-sm font-medium text-neutral-900">Email</p>
            <p className="text-xs text-neutral-500">contact@kpata.bj</p>
          </div>
        </a>

        <div className="pt-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-900">
            Questions fréquentes
          </h2>
          <div className="space-y-2 text-sm">
            <details className="rounded-card border border-neutral-100 p-3">
              <summary className="font-medium text-neutral-800">
                Comment suivre ma commande ?
              </summary>
              <p className="mt-2 text-neutral-500">
                Rendez-vous dans « Mes commandes » depuis votre compte pour voir
                le statut en temps réel.
              </p>
            </details>
            <details className="rounded-card border border-neutral-100 p-3">
              <summary className="font-medium text-neutral-800">
                Quels sont les délais de livraison ?
              </summary>
              <p className="mt-2 text-neutral-500">
                Entre 1 et 5 jours selon votre ville, indiqué lors de la commande.
              </p>
            </details>
            <details className="rounded-card border border-neutral-100 p-3">
              <summary className="font-medium text-neutral-800">
                Quels moyens de paiement acceptez-vous ?
              </summary>
              <p className="mt-2 text-neutral-500">
                Mobile Money, carte bancaire, et paiement à la livraison selon
                disponibilité.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
