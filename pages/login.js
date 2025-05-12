// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/dashboard');
    } else {
      setError(data.message || 'Gagal login');
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl mb-4">Login (6-digit PIN)</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          maxLength="6"
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="087819"
          className="border px-3 py-2 w-full"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Login
        </button>
      </form>
    </div>
  );
}
