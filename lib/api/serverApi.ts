import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';
import type { Note } from '@/types/note';

/* Auth */

export async function checkServerSession() {
  const cookieStore = await cookies();

  return api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

/* User */

export async function getServerMe(): Promise<User> {
  const cookieStore = await cookies();

  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

/* Notes */

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();

  try {
    const res = await api.get<FetchNotesResponse>('/notes', {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return res.data ?? { notes: [], totalPages: 0 };
  } catch {
    return { notes: [], totalPages: 0 };
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
}


