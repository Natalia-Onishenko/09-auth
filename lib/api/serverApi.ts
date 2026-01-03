import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
};

type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

function withCookie(cookieHeader?: string) {
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export async function fetchNotes(
  params: FetchNotesParams,
  cookieHeader?: string
): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: withCookie(cookieHeader),
  });
  return res.data;
}

export async function fetchNoteById(
  id: string,
  cookieHeader?: string
): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: withCookie(cookieHeader),
  });
  return res.data;
}

export async function getMe(cookieHeader?: string): Promise<User> {
  const res = await api.get<User>("/users/me", {
    headers: withCookie(cookieHeader),
  });
  return res.data;
}

export async function checkSession(
  cookieHeader?: string
): Promise<AxiosResponse<User | null>> {
  const res = await api.get<User | null>("/auth/session", {
    headers: withCookie(cookieHeader),
    validateStatus: (status) => status === 200,
  });
  return res;
}