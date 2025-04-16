"use client";

import React, { useState, useEffect } from 'react';
import TaulaUsuaris from './taulaUsuaris';
import FormulariUsuari from './formUsuaris';
import Filtres from './Filtres';
import { useRouter } from 'next/navigation';

export default function UsuariPage() {
  const [usuaris, setUsuaris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalUsuaris, settotalUsuaris] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const verifyAndRenew = async () => {
      // const res = await fetch('/api/admin/verify', { method: 'POST' });
      // if (res.status !== 200) {
      //   router.push('/login');
      //   return;
      // }

      fetchUsuaris(filters, page);

      const interval = setInterval(async () => {
        const renewRes = await fetch('/api/admin/renew', { method: 'POST' });
        if (renewRes.status === 401) {
          router.push('/login');
        }
      }, 50 * 60 * 1000);

      return () => clearInterval(interval);
    };

    verifyAndRenew();
  }, [router, filters, page]);

  const fetchUsuaris = async (filters = {}, page = 1) => {
    setLoading(true);

    const params = new URLSearchParams({
      ...filters,
      page,
      pageSize: 15,
    });

    try {
      const res = await fetch(`/api/usuaris?${params.toString()}`);
      const data = await res.json();

      if (res.status === 200) {
        setUsuaris(data.usuaris);
        setTotalPages(data.totalPages || 1);
        settotalUsuaris(data.totalGeneral || 0); // ← aquí!
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

      const result = await res.json();

      if (res.status === 201) {
        fetchUsuaris(filters, page);
      } else if (res.status === 400) {
        setErrors(result.details || {});
      } else if (res.status === 401) {
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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // reset a primera pàgina si canvies els filtres
  };

  return (
    <div>
      <h1>Crear Usuari</h1>
      <FormulariUsuari handleCreate={handleCreate} errors={errors} />
      
      <h2>Filtres</h2>
      <Filtres onChange={handleFiltersChange} />

      <h2>Llista d'Usuaris</h2>
      {loading ? <p>Carregant...</p> : <TaulaUsuaris usuaris={usuaris} totalUsuaris={totalUsuaris} />}

      <div style={{ marginTop: '1rem' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={{
              margin: '0 5px',
              fontWeight: n === page ? 'bold' : 'normal',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
