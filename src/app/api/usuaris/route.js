// src/app/api/usuaris/route.js
import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// export async function GET(req) {
//   const admin = await getTokenFromRequest(req);
//   if (!admin) {
//     return NextResponse.json({ error: 'No autoritzat' }, { status: 401 }); //TODO mostrar pagina not found per no donar informació de l'error
//   }

//   try {
//     const usuaris = await prisma.usuari.findMany({
//       orderBy: { dataAlta: 'desc' }
//     });
//     return NextResponse.json(usuaris);
//   } catch (error) {
//     return NextResponse.json({ error: 'Error al carregar usuaris' }, { status: 500 });
//   }
// }


export async function GET(req) {
  const admin = await getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;

  const nom = searchParams.get('nom') || undefined;
  const tipus = searchParams.get('tipus') || undefined;
  const preu = searchParams.get('preu') || undefined;
  const dataInici = searchParams.get('dataInici') || undefined;
  const dataFi = searchParams.get('dataFi') || undefined;
  const page = parseInt(searchParams.get('page')) || 1;
  const pageSize = parseInt(searchParams.get('pageSize')) || 10;

  const where = {};

  if (nom) {
    where.nom = { contains: nom, mode: 'insensitive' };
  }

  if (tipus) {
    where.tipus = tipus;
  }

  if (preu) {
    where.preu = parseFloat(preu);
  }

  if (dataInici && dataFi) {
    where.dataAlta = {
      gte: new Date(dataInici),
      lte: new Date(dataFi)
    };
  }

  try {
    const total = await prisma.usuari.count({ where });

    const usuaris = await prisma.usuari.findMany({
      where,
      orderBy: { dataAlta: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    return NextResponse.json({
      usuaris,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al carregar usuaris' }, { status: 500 });
  }
}



//Validació de les dades d'usuari amb Zod POST
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Accepta el format YYYY-MM-DD

const usuariSchema = z.object({

  nom: z.string().min(1, 'Nom és obligatori'),

  cognoms: z.string().min(1, 'Cognoms són obligatòris'),

  preu: z
  .string() // Inicialment arriba com a string
  .min(1, 'Preu és obligatori') // Valida que no estigui buit
  .transform((v) => parseFloat(v)) // Converteix a número flotant
  .refine((v) => !isNaN(v) && v >= 0, 'Preu ha de ser un número positiu'), // Valida que sigui un número positiu

  dni: z.string().transform((v) => (v === "" ? undefined : v)).optional(),

  numCarnet: z.string().transform((v) => (v === "" ? undefined : v)).optional(),

  email: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().email().optional()
  ),

  dataNaixement: z
  .string()
  .transform((valor) => (valor === "" ? undefined : valor)) // <-- converteix "" a undefined
  .refine((valor) => {
    if (!valor) return true; // Si és undefined, és vàlid (perquè és optional)
    if (dateRegex.test(valor)) {
      const dataConvertida = new Date(valor);
      return !isNaN(dataConvertida.getTime());
    }
    return false;
  }, {
    message: "La data de naixement no és vàlida. Utilitza el format YYYY-MM-DD.",
  })
  .transform((valor) => (valor ? new Date(valor) : undefined)) // converteix a Date si hi ha valor
  .optional(),

  tipus: z.enum(['NORMAL', 'INFANTIL', 'AQUAGYM', 'INFANTIL_NATACIO'])
});



  // POST: Crear usuaris
export async function POST(request) {

  const token = await getTokenFromRequest(request);  // Obtenir el token des de la cookie
  
  if (!token) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
  }

  let data;
  let validacio;

  try {
      data = await request.json();
       validacio = usuariSchema.safeParse(data);
      if (!validacio.success) {
          return NextResponse.json(
              { error: "Dades incorrectes", details: validacio.error.format() },
              { status: 400 }
          );
      }
  } catch (error) {
      return NextResponse.json({ error: "Error processant la petició" }, { status: 400 });
  }

  try {
      const nouUsuari = await prisma.usuari.create({ data: validacio.data });
      return NextResponse.json(nouUsuari, { status: 201 });
  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}