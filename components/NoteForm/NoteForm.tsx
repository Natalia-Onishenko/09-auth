"use client";

import { useEffect } from "react";
import { useActionState } from "react";

import type { NoteTag } from "../../types/note";
import { initialDraft, useNoteStore } from "../../lib/store/noteStore";
import {
  createNoteAction,
  type CreateActionState,
} from "../../app/(private routes)/notes/action/create/actions";

import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const initialState: CreateActionState = { ok: false, error: "" };

export default function NoteForm({ onClose }: { onClose: () => void }) {
  const { draft, setDraft, clearDraft } = useNoteStore();

  useEffect(() => {
    if (!draft) setDraft(initialDraft);
  }, [draft, setDraft]);

  const [state, formAction, pending] = useActionState(
    createNoteAction,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      clearDraft();
      onClose();
    }
  }, [state.ok, clearDraft, onClose]);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.currentTarget;
    setDraft({ [name]: value } as Partial<typeof initialDraft>);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <form className={css.form} action={formAction}>
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

      {state.error ? <p className={css.error}>{state.error}</p> : null}

      <div className={css.actions}>
        <button className={css.submit} type="submit" disabled={pending}>
          Create
        </button>

        <button className={css.cancel} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}