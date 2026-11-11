import Papa from 'papaparse';
import { InspectionRecord } from '../types/repuestos';

export const REPUESTOS_FLT_DOC_ID = '1lKiLDeMo7obOi580NUfGxNrcLf7fj5UO66xIQ4dX7oI';
export const REPUESTOS_FLT_GID = '0';

const SCRIPT_STORAGE_KEY = 'repuestos_flt_script_url_custom';
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhOxzKB7Ekt0r7c6GTv9gI5SVbB6YvQOoHerinQmrY5xjGYVkBM6B4Oog31mo2J0qa/exec';

export let REPUESTOS_FLT_SCRIPT_URL = (() => {
  if (typeof window !== 'undefined') {
    const custom = window.localStorage.getItem(SCRIPT_STORAGE_KEY);
    if (custom && custom.trim().length > 10 && !custom.includes('PENDIENTE') && !custom.includes('PONER_URL')) {
      return custom.trim();
    }
  }
  return DEFAULT_SCRIPT_URL;
})();

export const setCustomScriptUrl = (url: string) => {
  REPUESTOS_FLT_SCRIPT_URL = url.trim() || DEFAULT_SCRIPT_URL;
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      window.localStorage.setItem(SCRIPT_STORAGE_KEY, url.trim());
    } else {
      window.localStorage.removeItem(SCRIPT_STORAGE_KEY);
      REPUESTOS_FLT_SCRIPT_URL = DEFAULT_SCRIPT_URL;
    }
  }
};

export const isScriptConfigured = () => {
  return Boolean(
    REPUESTOS_FLT_SCRIPT_URL &&
    REPUESTOS_FLT_SCRIPT_URL.startsWith('https://script.google.com/macros/s/') &&
    !REPUESTOS_FLT_SCRIPT_URL.includes('PENDIENTE') &&
    !REPUESTOS_FLT_SCRIPT_URL.includes('PONER_URL_DEL_SCRIPT')
  );
};

export const isDefaultScriptUrl = () => {
  return !isScriptConfigured();
};

export const cleanSheetValue = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).replace(/^["']|["']$/g, '').trim();
};

export const getCacheBuster = () => `&_t=${Date.now()}`;

export const sendToGAS = async (payload: any, scriptUrl: string, expectJson = true): Promise<any> => {
  if (!scriptUrl || isDefaultScriptUrl()) {
    console.warn('Script URL no configurado aún; no se puede enviar a la hoja.');
    return { status: 'error', message: 'Script URL no configurado' };
  }

  const jsonStr = JSON.stringify(payload);

  // 1. Try server-side proxy first (bypasses browser CORS & 302 redirect errors completely)
  try {
    const proxyRes = await fetch('/api/gas-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scriptUrl,
        payload,
      }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return data;
    } else {
      try {
        const errData = await proxyRes.json();
        if (errData && errData.message) {
          return { status: 'error', message: errData.message };
        }
      } catch {
        // Continue to fallback
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy local no disponible, intentando envío directo...', proxyErr);
  }

  // 2. Direct fetch fallback with CORS handling
  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: jsonStr,
    });
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch {
      if (text.includes('Script function not found: doPost')) {
        return {
          status: 'error',
          message: 'Error en Google Apps Script: "Script function not found: doPost". En el editor de Apps Script debes crear una "Nueva versión" en Implementar > Administrar implementaciones.',
        };
      }
      if (text.includes('Authorization is required')) {
        return {
          status: 'error',
          message: 'Error en Google Apps Script: Se requiere autorizar permisos. Ejecuta testEnviarCorreo en el editor de Apps Script y haz clic en Permitir.',
        };
      }
      if (!expectJson) return { status: 'success' };
      return { status: 'error', message: text ? text.substring(0, 180) : 'Respuesta del servidor' };
    }
  } catch (err: any) {
    console.warn('Fallo fetch directo, intentando modo no-cors como último recurso:', err);
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: jsonStr,
      });
      // In no-cors mode, the request is dispatched to Google Apps Script successfully
      return { status: 'success', mode: 'no-cors' };
    } catch (noCorsErr: any) {
      console.error('Error final enviando a GAS:', noCorsErr);
      throw noCorsErr;
    }
  }
};

export const fetchDataFromGAS = async (docId: string, sheetName: string, scriptUrl: string): Promise<any[][] | null> => {
  if (!scriptUrl || isDefaultScriptUrl()) return null;
  const targetUrl = `${scriptUrl}?action=read&docId=${encodeURIComponent(docId)}&sheet=${encodeURIComponent(sheetName)}${getCacheBuster()}`;

  // Try proxy first
  try {
    const proxyUrl = `/api/gas-proxy?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const json = await res.json();
      if (json && json.status === 'success' && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch {
    // Continue to direct fetch
  }

  // Fallback direct
  try {
    const res = await fetch(targetUrl);
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.status === 'success' && Array.isArray(json.data)) {
      return json.data;
    }
    return null;
  } catch (e) {
    console.warn('No se pudo leer vía Apps Script:', e);
    return null;
  }
};

/**
 * submitRepuestoFltInspeccion debe devolver objeto con success y message
 */
export const submitRepuestoFltInspeccion = async (inspection: {
  fecha: string;
  fechaHora?: string;
  centro: string;
  inspector: string;
  items: { repuesto: string; cantidad: number; minimo: number; und: string }[];
  observacion?: string;
}): Promise<{ success: boolean; message?: string }> => {
  const payload = {
    method: 'POST_REPUESTO_FLT_INSPECCION',
    data: {
      ...inspection,
      docId: REPUESTOS_FLT_DOC_ID,
      sheetName: 'REPUESTOS',
    },
  };

  try {
    const result = await sendToGAS(payload, REPUESTOS_FLT_SCRIPT_URL, true);
    if (result && typeof result === 'object' && result.status === 'success') {
      return { success: true };
    }
    return {
      success: false,
      message: result?.message || 'El script no devolvió confirmación de guardado.',
    };
  } catch (e: any) {
    console.error('Fallo el guardado de inspección:', e);
    return {
      success: false,
      message: e?.message || 'Error de conexión con el script (verifique CORS o conectividad).',
    };
  }
};

/**
 * Lee ÚNICAMENTE la información real existente en la hoja REPUESTOS.
 * NUNCA inventa, simula ni genera datos de prueba.
 * Si la hoja está vacía o no hay datos registrados, retorna un arreglo vacío [].
 */
export const fetchRepuestoFltFromSheet = async (): Promise<InspectionRecord[]> => {
  const map = (rows: any[][]): InspectionRecord[] =>
    rows
      .slice(1)
      .filter(r => r && r[1] && r[3])
      .map(r => ({
        fecha: cleanSheetValue(r[0]),
        centro: cleanSheetValue(r[1]),
        inspector: cleanSheetValue(r[2]),
        repuesto: cleanSheetValue(r[3]),
        cantidad: Number(cleanSheetValue(r[4])) || 0,
        minimo: Number(cleanSheetValue(r[5])) || 0,
        und: cleanSheetValue(r[6]),
        estado: (cleanSheetValue(r[7]) || 'OK').toUpperCase() === 'ALERTA' ? 'ALERTA' : 'OK',
        observacion: cleanSheetValue(r[8]),
      }));

  // 1. Intentar leer vía Apps Script Web App
  try {
    const rows = await fetchDataFromGAS(REPUESTOS_FLT_DOC_ID, 'REPUESTOS', REPUESTOS_FLT_SCRIPT_URL);
    if (rows && rows.length >= 2) {
      return map(rows);
    }
  } catch (e) {
    console.warn('Fallo fetchDataFromGAS:', e);
  }

  // 2. Intentar leer vía export CSV público de la hoja REPUESTOS (gid 0)
  // URL exacta según instrucción: https://docs.google.com/spreadsheets/d/${REPUESTOS_FLT_DOC_ID}/export?format=csv&gid=${REPUESTOS_FLT_GID}${getCacheBuster()}
  try {
    const url = `https://docs.google.com/spreadsheets/d/${REPUESTOS_FLT_DOC_ID}/export?format=csv&gid=${REPUESTOS_FLT_GID}${getCacheBuster()}`;
    const r = await fetch(url);
    const csv = await r.text();
    if (csv && !csv.includes('<!DOCTYPE html')) {
      const p = Papa.parse(csv, { skipEmptyLines: true });
      if (p.data && (p.data as any[][]).length >= 2) {
        return map(p.data as any[][]);
      }
    }
  } catch (e) {
    console.warn('Fallo CSV fetch:', e);
  }

  // Si no hay datos reales en la hoja, devolver arreglo vacío (cero datos ficticios)
  return [];
};
