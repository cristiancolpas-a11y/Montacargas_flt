import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Proxy to Google Apps Script - avoids browser CORS & 302 redirect blocking
  app.post('/api/gas-proxy', async (req, res) => {
    try {
      const { scriptUrl, payload } = req.body;
      if (!scriptUrl) {
        return res.status(400).json({ status: 'error', message: 'Falta scriptUrl' });
      }

      const bodyStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: bodyStr,
        redirect: 'follow',
      });

      const text = await response.text();

      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        if (text.includes('Script function not found: doPost')) {
          return res.status(502).json({
            status: 'error',
            message: 'Error en Google Apps Script: "Script function not found: doPost". En el editor de Apps Script debes hacer clic en Implementar > Administrar implementaciones > Editar (lápiz) > Versión: Nueva versión > Implementar.',
          });
        }
        if (text.includes('Authorization is required')) {
          return res.status(403).json({
            status: 'error',
            message: 'Error en Google Apps Script: Se requiere autorizar permisos. Ejecuta testEnviarCorreo en el editor de Apps Script y haz clic en Permitir.',
          });
        }
        return res.json({ status: 'success', raw: text });
      }
    } catch (err: any) {
      console.error('Error in /api/gas-proxy:', err);
      return res.status(500).json({ status: 'error', message: err?.message || 'Error en proxy al conectar con Google Apps Script' });
    }
  });

  // Proxy GET for reading sheet data
  app.get('/api/gas-proxy', async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).json({ status: 'error', message: 'Falta targetUrl' });
      }

      const response = await fetch(targetUrl, {
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });

      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        return res.json({ status: 'success', raw: text });
      }
    } catch (err: any) {
      console.error('Error in GET /api/gas-proxy:', err);
      return res.status(500).json({ status: 'error', message: err?.message || 'Error en proxy GET' });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
