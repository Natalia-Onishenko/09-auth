"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { NoteTag } from "../../../../../types/note";

export interface CreateActionState {
  ok: boolean;
  error: string;
}

export async function createNoteAction(
  _: CreateActionState,
  formData: FormData
): Promise<CreateActionState> {
  const title = formData.get("title");
  const content = formData.get("content");
  const tag = formData.get("tag");

  if (!title || !content || !tag) {
    return { ok: false, error: "All fields are required" };
  }

  const cookieStore = cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notes`,
    {
      method: "POST",
      headers: {
        cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        tag: tag as NoteTag,
      }),
    }
  );

  if (!res.ok) {
    return { ok: false, error: "Failed to create note" };
  }

  revalidatePath("/notes");

  return { ok: true, error: "" };
}