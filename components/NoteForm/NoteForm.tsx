"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { NoteTag } from "../../types/note";
import { initialDraft, useNoteStore } from "../../lib/store/noteStore";
import { createNote } from "../../lib/api/clientApi";

import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

type Draft = typeof initialDraft;

type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

type NoteFormProps = {
  onClose?: () => void;
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  useEffect(() => {
    if (!draft) setDraft(initialDraft);
  }, [draft, setDraft]);

  const close = () => {
    if (onClose) onClose();
    else router.back();
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      close();
    },
  });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.currentTarget;
    setDraft({ [name]: value } as Partial<Draft>);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!draft) return;

    mutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: (draft.tag ?? "Todo") as NoteTag,
    });
  };

  const errorText =
    mutation.isError && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
      ? "Failed to create note"
      : "";

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.field}>
        <label className={css.label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft?.title ?? ""}
          onChange={handleChange}
          placeholder="Enter title"
          required
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft?.content ?? ""}
          onChange={handleChange}
          placeholder="Enter content"
          required
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="tag">
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={(draft?.tag ?? "Todo") as NoteTag}
          onChange={handleChange}
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {errorText ? <p className={css.error}>{errorText}</p> : null}

      <div className={css.actions}>
        <button
          className={css.submit}
          type="submit"
          disabled={mutation.isPending}
        >
          Create
        </button>

        <button className={css.cancel} type="button" onClick={close}>
          Cancel
        </button>
      </div>
    </form>
  );
}