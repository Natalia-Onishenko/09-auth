"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "../../../../lib/api/clientApi";
import type { Note } from "../../../../types/note";

import css from "./NoteDetailsPage.module.css";

export default function NoteDetailsClient({ noteId }: { noteId: string }) {
  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) return <p>Failed to load note</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.noteCard}>
        <h1 className={css.title}>{data.title}</h1>
        <p className={css.content}>{data.content}</p>
        <p className={css.tag}>{data.tag}</p>
      </div>
    </main>
  );
}