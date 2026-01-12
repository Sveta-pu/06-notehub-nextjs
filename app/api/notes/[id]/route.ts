import { NextResponse } from 'next/server';

const API_BASE = 'https://notehub-public.goit.study/api';

type RouteContext = { params: Promise<{ id: string }> };

const missingToken = () =>
  NextResponse.json(
    { message: 'Server token missing. Set NOTEHUB_TOKEN.' },
    { status: 500 }
  );

export async function GET(_request: Request, { params }: RouteContext) {
  const token = process.env.NOTEHUB_TOKEN;
  if (!token) return missingToken();

  const { id } = await params;

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? 'Failed to fetch note' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const token = process.env.NOTEHUB_TOKEN;
  if (!token) return missingToken();

  const { id } = await params;

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? 'Failed to delete note' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
