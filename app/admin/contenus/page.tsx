import { Clock } from "lucide-react";

export default function ComingSoonAdminPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white py-24 text-center">
      <Clock size={40} className="text-neutral-300" />
      <p className="text-sm text-neutral-500">Cette section arrive bientôt.</p>
    </div>
  );
}
