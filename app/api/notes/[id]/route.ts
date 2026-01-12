import { NextResponse } from 'next/server';

const API_BASE = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NOTEHUB_TOKEN;

const unauthorizedResponse = NextResponse.json(
  { message: 'Server token missing. Set NOTEHUB_TOKEN.' },
  { status: 500 }
);

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  if (!TOKEN) return unauthorizedResponse;

  const res = await fetch(`${API_BASE}/notes/${params.id}`, {
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

export async function DELETE(_request: Request, { params }: Params) {
  if (!TOKEN) return unauthorizedResponse;

  const res = await fetch(`${API_BASE}/notes/${params.id}`, {
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
