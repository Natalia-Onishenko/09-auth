// app/(private routes)/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "../../../../lib/api/clientApi";
import type { User } from "../../../../types/user";
import { useAuthStore } from "../../../../lib/store/authStore";

type MeResponse = User;

export default function EditProfilePage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const me: MeResponse = await getMe();
        if (cancelled) return;

        setLocalUser(me);
        setUsername(me.username);
      } catch {
        // proxy/authProvider should handle redirects
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      const updated = await updateMe({ username });
      setUser(updated);
      router.push("/profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    router.push("/profile");
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isSaving}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}