// lib/api/serverApi.ts
import { api } from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type FetchNotesParams = {
  page: number;
  perPage: number; // ALWAYS 12
  search?: string;
  tag?: NoteTag;
};

function withCookie(cookie: string) {
  return {
    headers: {
      Cookie: cookie,
    },
  };
}

export async function fetchNotes(params: FetchNotesParams, cookie: string): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    ...withCookie(cookie),
    params,
  });
  return data;
}

export async function fetchNoteById(id: string, cookie: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, withCookie(cookie));
  return data;
}

export async function getMe(cookie: string): Promise<User> {
  const { data } = await api.get<User>("/users/me", withCookie(cookie));
  return data;
}

export async function checkSession(cookie: string): Promise<User | null> {
  const res = await api.get<User | null>("/auth/session", withCookie(cookie));
  return res.data ?? null;
}