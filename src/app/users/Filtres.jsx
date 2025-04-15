"use client";

import React, { useState } from 'react';

const tipusOptions = [
  'NORMAL',
  'INFANTIL',
  'AQUAGYM',
  'INFANTIL_NATACIO',
];

export default function Filtres({ onChange }) {
  const [filters, setFilters] = useState({
    nom: '',
    dataInici: '',
    dataFi: '',
    preu: '',
    tipus: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onChange(cleanFilters(newFilters));
  };

  const cleanFilters = (obj) => {
    // Elimina valors buits per no enviar filtres innecessaris
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== '')
    );
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'grid', gap: '0.5rem' }}>
      <input
        type="text"
        name="nom"
        placeholder="Nom"
        value={filters.nom}
        onChange={handleInputChange}
      />

      <input
        type="date"
        name="dataInici"
        value={filters.dataInici}
        onChange={handleInputChange}
      />

      <input
        type="date"
        name="dataFi"
        value={filters.dataFi}
        onChange={handleInputChange}
      />

      <input
        type="number"
        step="0.01"
        name="preu"
        placeholder="Preu"
        value={filters.preu}
        onChange={handleInputChange}
      />

      <select
        name="tipus"
        value={filters.tipus}
        onChange={handleInputChange}
      >
        <option value="">-- Tipus --</option>
        {tipusOptions.map((tipus) => (
          <option key={tipus} value={tipus}>
            {tipus}
          </option>
        ))}
      </select>
    </div>
  );
}
