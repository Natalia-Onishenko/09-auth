// lib/api/clientApi.ts
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

type AuthBody = {
  email: string;
  password: string;
};

type UpdateMeBody = {
  username: string;
};

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: Pick<Note, "title" | "content" | "tag">): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(body: AuthBody): Promise<User> {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
}

export async function login(body: AuthBody): Promise<User> {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get<User | null>("/auth/session");
  return res.data ?? null;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(body: UpdateMeBody): Promise<User> {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
}