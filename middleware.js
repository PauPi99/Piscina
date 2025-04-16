import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('🔥 MIDDLEWARE ACTIVAT:', request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('🚫 No token -> redirecció a /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ Token trobat');
  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
  };
  
