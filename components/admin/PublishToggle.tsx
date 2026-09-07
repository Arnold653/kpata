"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PublishToggle({
  productId,
  isPublished,
}: {
  productId: string;
  isPublished: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function toggle() {
    setLoading(true);
    await supabase
      .from("products")
      .update({ is_published: !isPublished })
      .eq("id", productId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-neutral-100 text-neutral-500"
      }`}
    >
      {isPublished ? "Publié" : "Brouillon"}
    </button>
  );
}
