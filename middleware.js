
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

const protectedRoutes = ['/users'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('Middleware:', pathname);
  console.log('Protected Routes:', protectedRoutes);

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = cookies().get('token')?.value;
console.log('Token:', token);
    console.log('Request URL:', request.url);
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/users/:path*'], // Protegeix tot sota /users
  };