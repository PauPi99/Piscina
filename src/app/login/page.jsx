'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

//TODO mirar de fer-ho sense fer tantes peticions a l'API
  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch('/api/admin/renew', { method: 'POST' });
      if (res.status === 200) {
        router.push('/users');  // Redirigeix a la pàgina d'usuaris si ja està autenticat
      }
    };

    checkToken(); // Cridar la funció de comprovació
  }, [router]); // Incloure `router` com a dependència per evitar errors


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
      router.push('/users'); // Redirigeix a la pàgina principal
    } else {
      const data = await res.json();
      setError(data.error || 'Error d\'autenticació');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Inici de sessió</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'usuari"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
