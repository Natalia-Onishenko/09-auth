"use client";

import { useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "../../../../../lib/api/clientApi";
import type { NoteTag } from "../../../../../types/note";

import SearchBox from "../../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../../components/Pagination/Pagination";
import NoteList from "../../../../../components/NoteList/NoteList";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  tag: NoteTag;
}

export default function NotesClient({
  initialPage,
  initialSearch,
  tag,
}: NotesClientProps) {
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, search: debouncedSearch, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 10,
        search: debouncedSearch,
        tag,
      }),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (isError || !data) {
    return <p>Failed to load notes</p>;
  }

  return (
    <div className={css.wrapper}>
      <div className={css.topBar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <Link
          href="/notes/action/create"
          prefetch={false}
          className={css.createButton}
        >
          Create note
        </Link>
      </div>

      {data.notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <NoteList notes={data.notes} />
      )}

      {data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          pageCount={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}