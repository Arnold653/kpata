import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-white pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4">
        <Link href="/compte">
          <ChevronLeft size={22} />
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <Clock size={40} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Cette fonctionnalité arrive bientôt.
        </p>
      </div>
    </main>
  );
}
