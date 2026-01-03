// app/(private routes)/notes/[id]/NotePreview.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "../../../../../lib/api/clientApi";
import type { Note } from "../../../../../types/note";

import Modal from "../../../../../components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  noteId: string;
}

export default function NotePreviewClient({ noteId }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
  });

  const now = new Date().toLocaleDateString();

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <button className={css.backBtn} type="button" onClick={() => router.back()}>
          Back
        </button>

        <div className={css.item}>
          <div className={css.header}>
            <h2>Note #{noteId}</h2>
            <span className={css.tag}>{note?.tag ?? ""}</span>
          </div>

          <div className={css.content}>
            {isLoading && "Loading…"}
            {isError && "Failed to load note"}
            {!isLoading && !isError && note && (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </>
            )}
          </div>

          <div className={css.date}>{now}</div>
        </div>
      </div>
    </Modal>
  );
}