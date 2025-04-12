"use client";

import React, { useState, useEffect } from 'react';
import TaulaUsuaris from './taulaUsuaris';
import FormulariUsuari from './formUsuaris';
import { useRouter } from 'next/navigation';

export default function UsuariPage() {
  const [usuaris, setUsuaris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch('/api/admin/renew', { method: 'POST' });
      if (res.status === 401) {
        router.push('/login'); // Redirigeix a login si el token no és vàlid
      } else {
        fetchUsuaris(); // Si el token és vàlid, carrega els usuaris
      }
    };
  
    checkToken();
  }, []);
  
  // 🔁 REFRESH AUTOMÀTIC DEL TOKEN
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/admin/renew', { method: 'POST' });
      if (res.status === 401) {
        window.location.href = '/login'; // Redirigeix si falla la renovació
      }
    }, 50 * 60 * 1000); // Cada 50 minuts
  console.log('Token renovat!');
    return () => clearInterval(interval);
  }, []);


  // Obtenir usuaris des de l'API
  const fetchUsuaris = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuaris');
      const data = await res.json();
      if (res.status === 200) {
        setUsuaris(data); // Assignem els usuaris obtinguts a l'estat
      }
    } catch (err) {
      console.error('Error en la petició de usuaris:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuaris(); // Carregar usuaris en carregar la pàgina
  }, []);


  // Funció per crear un usuari
  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuaris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.status === 201) {
        fetchUsuaris();
      } else if (res.status === 400) {
        setErrors(result.details || {});
      } else {
        console.error('Error inesperat:', result.error);
      }
    } catch (err) {
      console.error('Error en la creació de l\'usuari:', err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h1>Crear Usuari</h1>
      <FormulariUsuari handleCreate={handleCreate} errors={errors} />
      <h2>Llista d'Usuaris</h2>
      {loading ? <p>Carregant...</p> : <TaulaUsuaris usuaris={usuaris} />}
    </div>
  );
}
