import { NextResponse } from 'next/server';

const API_BASE = 'https://notehub-public.goit.study/api';
const getToken = () => (process.env.NOTEHUB_TOKEN ?? '').trim();

const unauthorizedResponse = NextResponse.json(
  { message: 'Server token missing. Set NOTEHUB_TOKEN.' },
  { status: 500 }
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const TOKEN = getToken();
  if (!TOKEN) return unauthorizedResponse;

  const { id } = await params;

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: body.message ?? 'Failed to fetch note' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const TOKEN = getToken();
  if (!TOKEN) return unauthorizedResponse;

  const { id } = await params;

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: body.message ?? 'Failed to delete note' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
