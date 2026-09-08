"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MarkNotificationsRead({ ids }: { ids: string[] }) {
  const supabase = createClient();

  useEffect(() => {
    if (ids.length > 0) {
      supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", ids)
        .then(() => {});
    }
  }, []);

  return null;
}
