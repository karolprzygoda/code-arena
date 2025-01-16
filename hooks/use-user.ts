"use client";

import { useLayoutEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        router.replace("/sign-in");
      }

      setUser(user);
    })();
  }, [router]);

  return user;
}
