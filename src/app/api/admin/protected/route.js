// src/app/api/admin/protected/route.js
import jwt from 'jsonwebtoken';

export async function GET(req) {
  // Obtenir el token del header 'Authorization'
  const token = req.headers.get('Authorization')?.split(' ')[1];  // Format: "Bearer <token>"

  if (!token) {
    return new Response(JSON.stringify({ error: 'No estàs autenticat' }), { status: 401 });
  }

  // Verifica el token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token és vàlid, continua amb la resposta
    return new Response(JSON.stringify({ message: 'Accés autoritzat', admin: decoded }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Token no vàlid o caducat' }), { status: 401 });
  }
}
