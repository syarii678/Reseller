// lib/auth.js
import { serialize, parse } from 'cookie';
import crypto from 'crypto';

const TOKEN_NAME = 'session_token';
const MAX_AGE = 60 * 60 * 8; // 8 jam

export function createSession(res) {
  // buat token random
  const token = crypto.randomBytes(16).toString('hex');
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
  return token;
}

export function destroySession(res) {
  const cookie = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getSessionToken(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const parsed = parse(cookies);
  return parsed[TOKEN_NAME] || null;
}
