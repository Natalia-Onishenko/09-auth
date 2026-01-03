import NotePreview from "../../../../../components/NotePreview/NotePreview";

type PageProps = {
  params: { id: string };
};

export default function NoteModalPage({ params }: PageProps) {
  return <NotePreview noteId={params.id} />;
}