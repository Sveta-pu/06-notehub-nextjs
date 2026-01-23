import { useState } from 'react';
import css from './NoteList.module.css';
import { type Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import Link from 'next/link';

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    onError: (_error, id) => {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    setDeletingIds(prev => new Set(prev).add(id));
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map(item => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <Link className={css.routerLink} href={`/notes/${item.id}`}>
              View details
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(item.id, item.title)}
              className={css.button}
              disabled={deletingIds.has(item.id)}
              aria-label={`Delete note: ${item.title}`}
            >
              {deletingIds.has(item.id) ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
