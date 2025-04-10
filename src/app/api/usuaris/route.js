// src/app/api/usuaris/route.js
import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export async function GET(req) {
  const admin = await getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
  }

  try {
    const usuaris = await prisma.usuari.findMany({
      orderBy: { dataAlta: 'desc' }
    });
    return NextResponse.json(usuaris);
  } catch (error) {
    return NextResponse.json({ error: 'Error al carregar usuaris' }, { status: 500 });
  }
}


const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Accepta el format YYYY-MM-DD

const usuariSchema = z.object({
  nom: z.string().min(1, 'Nom és obligatori'),
  cognoms: z.string().min(1, 'Cognoms són obligatòris'),
  preu: z.number().min(0, 'Preu ha de ser positiu'),
  dni: z.string().optional(),
  numCarnet: z.string().optional(),
  email: z.string().email().optional(),
  dataNaixement: z
    .string()
    .refine((valor) => {
      // Comprovem si la data és vàlida
      if (valor && dateRegex.test(valor)) {
        const dataConvertida = new Date(valor);
        return !isNaN(dataConvertida.getTime()); // Si és una data vàlida
      }
      return false; // Si la data no és vàlida, retornem false
    }, {
      message: "La data de naixement no és vàlida. Utilitza el format YYYY-MM-DD.",
    })
    .transform((valor) => {
      if (valor && dateRegex.test(valor)) {
        return new Date(valor); // Converteix la data si és vàlida
      }
      throw new Error("La data de naixement no és vàlida. Utilitza el format YYYY-MM-DD."); // Llença error si la data és invàlida
    })
    .optional(), // El camp és opcional
  tipus: z.enum(['NORMAL', 'INFANTIL', 'AQUAGYM', 'INFANTIL_NATACIO'])
});


  // Funció per crear l'usuari
  export async function POST(req) {
    const token = await getTokenFromRequest(req);  // Obtenir el token des de la cookie
  
    if (!token) {
      return new NextResponse('No autoritzat', { status: 401 });
    }
  
    const body = await req.json();
    try {
      // Validació de les dades amb Zod
      const validatedData = usuariSchema.parse(body);
  
      // Creació de l'usuari a la base de dades
      const usuari = await prisma.usuari.create({
        data: validatedData
      });
  
      return new NextResponse(JSON.stringify(usuari), { status: 201 });
    } catch (error) {
      
      console.error(error);
      return new NextResponse(JSON.stringify({ message: 'Error de validació', details: error.errors }), { status: 400 });
    }
  }