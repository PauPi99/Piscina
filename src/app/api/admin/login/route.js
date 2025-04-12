import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'clau-super-secreta';

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dades incorrectes' }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      return NextResponse.json({ error: 'Usuari no trobat' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return NextResponse.json({ error: 'Contrasenya incorrecta' }, { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '30s' });
    console.log('Token generat:', token);

    // Espera a que la cookie es posi
    const response = NextResponse.json({ message: 'Sessió iniciada' }, { status: 200 });

   // Estableix la cookie amb el token
    response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hora
  });

    return response

  } catch (err) {
    console.error('Error al fer login:', err);
    return NextResponse.json({ error: 'Error intern' }, { status: 500 });
  }
}
