"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import {
  fetchNotes,
  type FetchNotesResponse,
} from "../../../../../lib/api/clientApi";
import type { NoteTag } from "../../../../../types/note";

import SearchBox from "../../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../../components/Pagination/Pagination";
import NoteList from "../../../../../components/NoteList/NoteList";
import Modal from "../../../../../components/Modal/Modal";
import NoteForm from "../../../../../components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

export default function NotesClient({
  page,
  search,
  tag,
}: {
  page: number;
  search: string;
  tag?: NoteTag;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(page);
  const [searchValue, setSearchValue] = useState(search);
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());

    next.set("page", String(currentPage));

    if (debouncedSearch) next.set("search", debouncedSearch);
    else next.delete("search");

    router.replace(`?${next.toString()}`);
  }, [currentPage, debouncedSearch, router, searchParams]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, search]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { page: currentPage, search: debouncedSearch, tag }],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch || undefined,
        tag,
      }),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchValue} onChange={setSearchValue} />
        <button
          type="button"
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p>Failed to load notes</p>}

      {!isLoading && !isError && (
        <>
          {notes.length === 0 ? <p>No notes found</p> : <NoteList notes={notes} />}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              pageCount={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}