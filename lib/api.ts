import { Note } from '@/types/note';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return 'http://localhost:3000';
};

const handleResponse = async <T>(res: Response, fallbackMessage: string) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.message ?? fallbackMessage;
    throw new Error(message);
  }
  return (await res.json()) as T;
};

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  const base = getBaseUrl();
  const qs = new URLSearchParams({
    page: String(page),
    perPage: '12',
    search,
  });

  const res = await fetch(`${base}/api/notes?${qs.toString()}`, {
    cache: 'no-store',
  });
  return handleResponse<NotesResponse>(res, 'Failed to load notes');
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return handleResponse<Note>(res, 'Failed to create note');
};

export const deleteNote = async (id: string): Promise<Note> => {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/notes/${id}`, { method: 'DELETE' });
  return handleResponse<Note>(res, 'Failed to delete note');
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/notes/${id}`, { cache: 'no-store' });
  return handleResponse<Note>(res, 'Failed to load note');
};

export const useFetchNotes = (currentPage: number, search: string) => {
  return useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
