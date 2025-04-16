import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getTokenFromCookies() {
  try {
    const cookieStore = await cookies(); // Ha de ser esperat amb await
    const token = cookieStore.get('token')?.value; // Obtenim el token de la cookie
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}
