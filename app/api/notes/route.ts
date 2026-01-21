import { NextResponse } from 'next/server';

const API_BASE = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NOTEHUB_TOKEN;
const getToken = () => (process.env.NOTEHUB_TOKEN ?? '').trim();

const unauthorizedResponse = NextResponse.json(
  { message: 'Server token missing. Set NOTEHUB_TOKEN.' },
  { status: 500 }
);

export async function GET(request: Request) {
  const TOKEN = getToken();
  if (!TOKEN) return unauthorizedResponse;

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('perPage') ?? '12';
  const search = searchParams.get('search') ?? '';

  const url = new URL(`${API_BASE}/notes`);
  url.searchParams.set('page', page);
  url.searchParams.set('perPage', perPage);
  url.searchParams.set('search', search);

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: body.message ?? 'Failed to fetch notes' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  if (!TOKEN) return unauthorizedResponse;

  const payload = await request.json();

  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: body.message ?? 'Failed to create note' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}
