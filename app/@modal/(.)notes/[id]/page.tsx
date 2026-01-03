import { headers } from "next/headers";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { fetchNoteById } from "../../../../lib/api/serverApi";
import NotePreview from "../../../../components/NotePreview/NotePreview";

type Params = Promise<{ id: string }>;

export default async function NoteModalPage({ params }: { params: Params }) {
  const { id } = await params;

  const cookie = (await headers()).get("cookie") ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id, cookie),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}