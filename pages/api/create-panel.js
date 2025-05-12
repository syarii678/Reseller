// pages/api/create-panel.js
import fetch from 'node-fetch';
import { getSessionToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // cek session
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const { name, memory } = req.body;

  try {
    const pteroRes = await fetch(
      `${process.env.PTERO_API_URL}/api/application/servers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PTERO_API_KEY}`,
        },
        body: JSON.stringify({
          name,
          user: 1,               // ID user di Pterodactyl (ubah sesuai)
          egg: 1,                // ID egg default (ubah sesuai)
          docker_image: 'quay.io/pterodactyl/core:java-17', // contoh
          ram: memory,
          cpu: 100,
          disk: 10240,
          location: 1,           // default lokasi node
          startup: 'java -Xms{{SERVER_MEMORY}}M -Xmx{{SERVER_MEMORY}}M -jar server.jar',
          environment: { SERVER_JARFILE: 'server.jar' },
        }),
      }
    );
    const data = await pteroRes.json();
    res.status(pteroRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
