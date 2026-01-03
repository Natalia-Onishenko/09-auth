// app/(private routes)/profile/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description: "User profile page",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Profile Page | NoteHub",
    description: "User profile page",
    type: "website",
  },
};

export default function ProfilePage() {
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link
            href="/profile/edit"
            prefetch={false}
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src="https://ac.goit.global/fullstack/react/default-avatar.png"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: your_email@example.com</p>
        </div>
      </div>
    </main>
  );
}