import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');

  if (!tokenCookie || !tokenCookie.value) {
    return NextResponse.json({ error: 'No hi ha token de sessió.' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const newToken = await new SignJWT({
      userId: payload.userId,
      username: payload.username,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: 'Token renovat' });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge: 60 * 60, // 1 hora
    });

    return response;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    return NextResponse.json({ error: 'Token invàlid o caducat.' }, { status: 401 });
  }
}
