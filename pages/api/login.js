// pages/api/login.js
import { createSession, destroySession } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { pin } = req.body;
  if (pin === process.env.PIN_CODE) {
    // buat cookie session
    createSession(res);
    return res.status(200).json({ success: true });
  } else {
    // hapus cookie lama kalau ada
    destroySession(res);
    return res.status(401).json({ success: false, message: 'PIN salah' });
  }
}
