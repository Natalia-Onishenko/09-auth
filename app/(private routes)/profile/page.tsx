import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'User profile page',

  openGraph: {
    title: 'Profile | NoteHub',
    description: 'User profile page',
    type: 'profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/avatar.png',
        width: 120,
        height: 120,
        alt: 'User avatar',
      },
    ],
  },
};

export default async function ProfilePage () {
  const user = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || 'https://ac.goit.global/fullstack/react/avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

