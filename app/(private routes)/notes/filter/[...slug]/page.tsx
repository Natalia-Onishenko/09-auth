// app/(private routes)/notes/filter/[...slug]/page.tsx

import { cookies } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "../../../../../lib/api/serverApi";
import type { NoteTag } from "../../../../../types/note";
import NotesClient from "./Notes.client";

type Params = {
  slug?: string[];
};

type SearchParams = {
  page?: string;
  search?: string;
};

type Props = {
  params: Params;
  searchParams?: SearchParams;
};

export default async function NotesFilterPage({
  params,
  searchParams,
}: Props) {
  const page = Number(searchParams?.page ?? 1);
  const search = searchParams?.search ?? "";

  const tag = params.slug?.[0] as NoteTag | undefined;

  const cookie = cookies().toString();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () =>
      fetchNotes(
        {
          page,
          perPage: 12,
          search,
          tag,
        },
        cookie
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient page={page} search={search} tag={tag} />
    </HydrationBoundary>
  );
}