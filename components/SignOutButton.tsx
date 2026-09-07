"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="mt-6 w-full rounded-full border border-neutral-200 py-3 text-sm font-medium text-neutral-700"
    >
      Se déconnecter
    </button>
  );
}
