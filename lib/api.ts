import { Note } from '@/types/note';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
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

type ErrorBody = {
  message?: string;
};

const getAuthHeader = () => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_API_TOKEN for authorized requests');
  }

  return { Authorization: `Bearer ${token}` };
};

const getClient = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    headers: getAuthHeader(),
  });
};

const handleAxiosError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ErrorBody | undefined;
    const message = body?.message ?? fallbackMessage;
    throw new Error(message);
  }

  throw new Error(fallbackMessage);
};

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  try {
    const client = getClient();
    const { data } = await client.get<NotesResponse>('/api/notes', {
      params: {
        page,
        perPage: 12,
        search,
      },
    });

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to load notes');
  }
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  try {
    const client = getClient();
    const { data } = await client.post<Note>('/api/notes', noteData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create note');
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const client = getClient();
    const { data } = await client.delete<Note>(`/api/notes/${id}`);

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete note');
  }
};

export const getSingleNote = async (id: string): Promise<Note> => {
  try {
    const client = getClient();
    const { data } = await client.get<Note>(`/api/notes/${id}`);

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to load note');
  }
};

export const useFetchNotes = (currentPage: number, search: string) => {
  return useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
