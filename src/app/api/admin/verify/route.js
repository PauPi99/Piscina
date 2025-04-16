import { getTokenFromCookies } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const payload = await getTokenFromCookies();

  if (!payload) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
