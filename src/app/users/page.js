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

  // ✅ Verificació inicial i inici de renovació
  useEffect(() => {
    const verifyAndRenew = async () => {
      const res = await fetch('/api/admin/verify', { method: 'POST' });
      if (res.status !== 200) {
        router.push('/login');
        return;
      }

    fetchUsuaris();

      // ✅ Només si és vàlid, inicia el refresc automàtic
      const interval = setInterval(async () => {
        const renewRes = await fetch('/api/admin/renew', { method: 'POST' });
        if (renewRes.status === 401) {
          router.push('/login');
        }
      }, 50 * 60 * 1000); // Cada 50 minuts

      return () => clearInterval(interval);
    };

    verifyAndRenew();
  }, [router]);

  const fetchUsuaris = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuaris');
      const data = await res.json();
      if (res.status === 200) {
        setUsuaris(data);
      }
    } catch (err) {
      console.error('Error en carregar usuaris:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuaris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json(); // Sempre esperar JSON
  
      if (res.status === 201) {
        fetchUsuaris();
      } else if (res.status === 400) {
        setErrors(result.details || {});
      } else if (res.status === 401) {
        // Si el token és invàlid o caducat, redirigeix a login
        router.push('/login');
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
