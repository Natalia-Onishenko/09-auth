// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession, logout } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setBlocked(false);

      try {
        const user = await checkSession();
        if (cancelled) return;

        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }

        throw new Error("No session");
      } catch {
        if (cancelled) return;

        try {
          await logout();
        } catch {}

        clearIsAuthenticated();

        if (isPrivatePath(pathname)) {
          setBlocked(true);
          router.replace("/sign-in");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading…</p>;
  if (blocked) return null;

  return <>{children}</>;
}