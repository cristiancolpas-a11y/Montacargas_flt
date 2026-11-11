import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Save, 
  Send 
} from 'lucide-react';
import { 
  GAS_SCRIPT_CODE, 
  RESPONSABLE, 
  PROVEEDOR, 
  COPIA_FIJA 
} from '../constants/repuestosData';
import { 
  REPUESTOS_FLT_SCRIPT_URL, 
  REPUESTOS_FLT_DOC_ID, 
  REPUESTOS_FLT_GID, 
  setCustomScriptUrl 
} from '../services/sheetService';

interface ScriptConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated: () => void;
}

export const ScriptConfigModal: React.FC<ScriptConfigModalProps> = ({
  isOpen,
  onClose,
  onUrlUpdated,
}) => {
  const [scriptUrl, setScriptUrl] = useState(REPUESTOS_FLT_SCRIPT_URL || '');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = () => {
    setCustomScriptUrl(scriptUrl);
    setSaveSuccess(true);
    onUrlUpdated();
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!scriptUrl || scriptUrl.includes('PONER_URL_DEL_SCRIPT')) {
      setTestResult('⚠️ Ingrese una URL válida de Apps Script.');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const url = `${scriptUrl}?action=read&docId=${REPUESTOS_FLT_DOC_ID}&sheet=REPUESTOS&_t=${Date.now()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json && json.status === 'success') {
        setTestResult('✅ Conexión exitosa con Google Apps Script y Hoja REPUESTOS.');
      } else {
        setTestResult(`ℹ️ Respuesta recibida: ${json.message || JSON.stringify(json)}`);
      }
    } catch (e: any) {
      setTestResult('⚠️ No se pudo verificar directamente (puede deberse a CORS de navegador). Al enviar POST se usará modo no-cors automático.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0D2B4E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#F2B705]" />
            <h3 className="text-base font-bold text-white">
              Configuración de Backend Google Apps Script
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-neutral-600">
          {/* Instrucciones de Despliegue */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <h4 className="font-bold text-[#0D2B4E] text-xs uppercase tracking-wider">
              Instrucciones para el Administrador
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-700">
              <li>
                Abrir <strong>Google Sheets</strong> (ID: <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">{REPUESTOS_FLT_DOC_ID}</code>).
              </li>
              <li>
                Ir a <strong>Extensiones &gt; Apps Script</strong> con la cuenta{' '}
                <strong className="text-[#0D2B4E]">soporte.regionalnorte@fleetmanagement-rn.com</strong> (esto garantiza que los correos de alerta salgan desde esa dirección).
              </li>
              <li>
                Pegar el código fuente provisto abajo y hacer clic en <strong>Implementar &gt; Nueva implementación</strong>.
              </li>
              <li>
                Seleccionar tipo <strong>Aplicación web</strong>, ejecutar como: <em>"Yo"</em>, y quién tiene acceso: <em>"Cualquier persona"</em>.
              </li>
              <li>
                Copiar la URL terminada en <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">/exec</code> y pegarla en el campo inferior.
              </li>
            </ol>
          </div>

          {/* Script URL Input & Test */}
          <div className="space-y-2">
            <label htmlFor="script-url" className="block font-bold text-neutral-800">
              URL del Script Web App (REPUESTOS_FLT_SCRIPT_URL)
            </label>
            <div className="flex gap-2">
              <input
                id="script-url"
                type="url"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                className="flex-1 font-mono text-xs bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/20"
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                className="px-3.5 py-2 bg-[#0D2B4E] hover:bg-[#0D2B4E]/90 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Save className="w-3.5 h-3.5" />}
                <span>Guardar</span>
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg flex items-center gap-1 transition-colors border border-neutral-200"
              >
                <Send className="w-3.5 h-3.5 text-neutral-500" />
                <span>{testing ? 'Probando...' : 'Probar'}</span>
              </button>
            </div>
            {testResult && (
              <p className="text-xs p-2 rounded bg-neutral-100 border border-neutral-200 font-medium text-neutral-800">
                {testResult}
              </p>
            )}
          </div>

          {/* Código Apps Script para Copiar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800">
                Código Fuente Completo Google Apps Script
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded font-medium border border-neutral-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="bg-[#111827] text-neutral-200 p-3 rounded-lg overflow-x-auto text-[11px] font-mono max-h-48 border border-neutral-800 leading-relaxed">
              {GAS_SCRIPT_CODE}
            </pre>
          </div>

          {/* Información de Destinatarios de Alerta */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-600">
            <span className="font-bold text-neutral-800 block mb-1">
              Políticas de Correo de Alerta
            </span>
            <p>
              Cuando un repuesto esté bajo el mínimo requerido, el correo saldrá desde{' '}
              <strong>soporte.regionalnorte@fleetmanagement-rn.com</strong> con destinatario (TO) al responsable del centro, copia (CC) al proveedor asignado, y copia fija a:{' '}
              <code className="font-mono text-neutral-800 text-[11px]">{COPIA_FIJA}</code>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
