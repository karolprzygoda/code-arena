"use client";

import { useLayoutEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { jwtDecode } from "jwt-decode";

export default function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useLayoutEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const jwt: { user_role: string } = jwtDecode(session.access_token);
        setUserRole(jwt.user_role);
      }
    })();
  }, []);

  return userRole;
}
