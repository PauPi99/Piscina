import bcrypt from 'bcrypt';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req) {
  try {

    const tokenValid = await getTokenFromRequest(req);
    if (!tokenValid) {
      return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dades incorrectes' }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'Admin ja existeix' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { username, password: hashed },
    });

    return NextResponse.json({ message: 'Admin creat correctament' }, { status: 201 });

  } catch (error) {
    console.error('Error al crear admin:', error);
    return NextResponse.json({ error: 'Error intern' }, { status: 500 });
  }
}
