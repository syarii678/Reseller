// pages/dashboard.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSessionToken } from '../lib/auth';

export default function Dashboard({ authenticated }) {
  const [name, setName] = useState('');
  const [mem, setMem] = useState(1024);
  const [output, setOutput] = useState(null);

  const router = useRouter();
  if (!authenticated) {
    if (typeof window !== 'undefined') router.replace('/login');
    return null;
  }

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/create-panel', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, memory: mem }),
    });
    const data = await res.json();
    setOutput(data);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl mb-4">Buat Server Panel</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Nama Server"
          className="border px-3 py-2 w-full"
          required
        />
        <input
          type="number"
          value={mem}
          onChange={e=>setMem(Number(e.target.value))}
          placeholder="Memory (MB)"
          className="border px-3 py-2 w-full"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Create
        </button>
      </form>
      {output && (
        <pre className="bg-gray-100 p-4 mt-6">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const token = getSessionToken(req);
  return {
    props: { authenticated: !!token }
  };
}
