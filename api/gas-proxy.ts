// Función de Vercel: reenvía a Google Apps Script (evita bloqueos CORS del navegador).
// Equivale a la ruta /api/gas-proxy de server.ts, que no corre en Vercel.
// Solo permite destinos de Google para que no se use como proxy abierto.

const PERMITIDO = /^https:\/\/(script\.google\.com\/macros\/s\/|script\.googleusercontent\.com\/|docs\.google\.com\/spreadsheets\/)/;

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const { scriptUrl, payload } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
      if (!scriptUrl || !PERMITIDO.test(scriptUrl)) {
        return res.status(400).json({ status: 'error', message: 'URL de Apps Script no válida' });
      }
      const r = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: typeof payload === 'string' ? payload : JSON.stringify(payload),
        redirect: 'follow',
      });
      const text = await r.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        if (text.includes('Script function not found: doPost')) {
          return res.status(502).json({ status: 'error', message: 'Apps Script sin doPost publicado: crea una nueva versión de la implementación.' });
        }
        if (text.includes('Authorization is required')) {
          return res.status(403).json({ status: 'error', message: 'Apps Script requiere autorizar permisos (ejecuta testEnviarCorreo y permite).' });
        }
        return res.status(200).json({ status: 'success', raw: text.slice(0, 500) });
      }
    }

    if (req.method === 'GET') {
      const url = String(req.query?.url || '');
      if (!PERMITIDO.test(url)) return res.status(400).json({ status: 'error', message: 'URL no permitida' });
      const r = await fetch(url, { headers: { Accept: 'application/json' }, redirect: 'follow' });
      const text = await r.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).json({ status: 'success', raw: text.slice(0, 500) });
      }
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err?.message || 'Error en el proxy de Apps Script' });
  }
}
