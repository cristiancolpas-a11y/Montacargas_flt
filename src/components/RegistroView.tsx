import React, { useState, useEffect, useMemo } from 'react';
import { 
  RepuestoFormItem 
} from '../types/repuestos';
import { 
  CENTRO_RANGO, 
  STOCK_POR_RANGO, 
  RESPONSABLE, 
  PROVEEDOR, 
  COPIA_FIJA 
} from '../constants/repuestosData';
import { submitRepuestoFltInspeccion } from '../services/sheetService';
import { 
  Calendar, 
  User, 
  Save, 
  Check, 
  Minus, 
  Plus, 
  AlertTriangle, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface RegistroViewProps {
  initialCentro: string;
  onInspectionSaved: (centro: string) => void;
  onVolverCentros?: () => void;
}

export const RegistroView: React.FC<RegistroViewProps> = ({
  initialCentro,
  onInspectionSaved,
  onVolverCentros,
}) => {
  const getTodayString = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const getTodayDateTimeString = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const [fecha, setFecha] = useState(getTodayString());
  const [inspector, setInspector] = useState('');
  const [observacion, setObservacion] = useState('');

  // Items state: cantidad starts EMPTY string ('')
  const [items, setItems] = useState<RepuestoFormItem[]>([]);
  
  // Validation error states
  const [missingIndices, setMissingIndices] = useState<Set<number>>(new Set());
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  // Result modal state (ONLY shown after successful save)
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{
    total: number;
    okCount: number;
    alertaCount: number;
    alertas: { repuesto: string; encontrado: number; minimo: number; deficit: number; und: string }[];
  } | null>(null);

  // Live neutral emoticon counter
  const { cumpleCount, alertaCount, pendientesCount } = useMemo(() => {
    let cumple = 0;
    let alerta = 0;
    let pendientes = 0;

    items.forEach((it) => {
      if (it.cantidad.trim() === '' || isNaN(Number(it.cantidad))) {
        pendientes++;
      } else {
        const num = Number(it.cantidad);
        if (num >= it.minimo) {
          cumple++;
        } else {
          alerta++;
        }
      }
    });

    return { cumpleCount: cumple, alertaCount: alerta, pendientesCount: pendientes };
  }, [items]);

  // Initialize items when centro changes: Cantidad Encontrada inicia VACÍO ('')
  useEffect(() => {
    const rango = CENTRO_RANGO[initialCentro] || 'RANGO_2';
    const repuestosList = STOCK_POR_RANGO[rango] || [];
    
    const initialItems: RepuestoFormItem[] = repuestosList.map((item) => ({
      repuesto: item.repuesto,
      cantidad: '', // Inicia VACÍO
      minimo: item.minimo,
      und: item.und,
    }));

    setItems(initialItems);
    setMissingIndices(new Set());
    setValidationError('');
    setServerError('');
  }, [initialCentro]);

  // Handle quantity changes: completely neutral without live badges/colors
  const handleQuantityChange = (index: number, val: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], cantidad: val };
      return copy;
    });

    // Clear missing mark if user types
    if (val.trim() !== '') {
      setMissingIndices((prev) => {
        const copy = new Set(prev);
        copy.delete(index);
        return copy;
      });
    }
  };

  const handleStepQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const raw = copy[index].cantidad;
      const current = raw === '' ? 0 : Math.max(0, parseFloat(raw) || 0);
      const next = Math.max(0, current + delta);
      copy[index] = { ...copy[index], cantidad: String(next) };
      return copy;
    });

    setMissingIndices((prev) => {
      const copy = new Set(prev);
      copy.delete(index);
      return copy;
    });
  };

  // Submit Handler: Validar todo, deshabilitar botón y procesar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setServerError('');

    // 1. Validar que el inspector tenga nombre
    if (!inspector.trim()) {
      setValidationError('Por favor ingrese el nombre del Inspector.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validar que TODAS las cantidades estén diligenciadas (0 es válido, pero string vacía no)
    const missing = new Set<number>();
    items.forEach((it, idx) => {
      if (it.cantidad === '' || it.cantidad == null || isNaN(Number(it.cantidad))) {
        missing.add(idx);
      }
    });

    if (missing.size > 0) {
      setMissingIndices(missing);
      setValidationError(`Faltan ${missing.size} repuestos por diligenciar. Ingrese la cantidad encontrada para cada uno (0 es válido).`);
      // Scroll al primer campo faltante
      const firstMissingEl = document.getElementById(`repuesto-item-${Array.from(missing)[0]}`);
      if (firstMissingEl) {
        firstMissingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 3. Si todo está completo: deshabilitar el botón de inmediato y enviar
    setIsSubmitting(true);
    const fechaHora = getTodayDateTimeString();

    const payloadItems = items.map((it) => {
      const cant = Number(it.cantidad);
      return {
        repuesto: it.repuesto,
        cantidad: cant,
        minimo: it.minimo,
        und: it.und,
      };
    });

    try {
      const res = await submitRepuestoFltInspeccion({
        fecha,
        fechaHora,
        centro: initialCentro,
        inspector: inspector.trim(),
        items: payloadItems,
        observacion: observacion.trim(),
      });

      if (res.success) {
        // Calcular resultado del guardado para mostrar en el modal
        const alertasCalculadas: { repuesto: string; encontrado: number; minimo: number; deficit: number; und: string }[] = [];
        let okCount = 0;

        payloadItems.forEach((it) => {
          if (it.cantidad < it.minimo) {
            alertasCalculadas.push({
              repuesto: it.repuesto,
              encontrado: it.cantidad,
              minimo: it.minimo,
              deficit: it.minimo - it.cantidad,
              und: it.und,
            });
          } else {
            okCount++;
          }
        });

        setResultData({
          total: payloadItems.length,
          okCount,
          alertaCount: alertasCalculadas.length,
          alertas: alertasCalculadas,
        });

        setShowResultModal(true);
        onInspectionSaved(initialCentro);
      } else {
        // 4. Si el envío falla: mostrar error claro, re-habilitar el botón y conservar lo digitado
        setServerError(res.message || 'No se pudo guardar la inspección en la hoja. Verifique la conexión o el script y vuelva a intentarlo.');
      }
    } catch (err: any) {
      setServerError(`Error al conectar con el servidor: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const responsableEmail = RESPONSABLE[initialCentro] || 'N/D';
  const proveedorEmail = PROVEEDOR[initialCentro] || 'N/D';

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Step 1: General Inspection Information Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
            <div className="flex items-start sm:items-center gap-3">
              {onVolverCentros && (
                <button
                  type="button"
                  onClick={onVolverCentros}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-bold text-neutral-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Volver a centros</span>
                </button>
              )}
              <div>
                <div className="text-xs text-neutral-500 font-medium">
                  Sub-módulo Registro
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B4E] tracking-tight mt-0.5">
                  Inspección de Repuestos · {initialCentro}
                </h2>
              </div>
            </div>

            <div className="text-xs font-semibold text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
              Total de repuestos a revisar: <strong className="text-neutral-800 font-mono">{items.length}</strong>
            </div>
          </div>

          {/* Validation & Server Error Banners */}
          {validationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-lg flex items-center gap-2 text-xs text-[#DC2626] font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {serverError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-lg flex items-center gap-2 text-xs text-[#DC2626] font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form Fields: Fecha, Centro (solo lectura), Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="fecha" className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Fecha de Inspección *</span>
              </label>
              <input
                id="fecha"
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/20"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-neutral-700 mb-1">
                Centro Seleccionado
              </span>
              <div className="w-full text-xs font-bold bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-[#0D2B4E]">
                {initialCentro}
              </div>
            </div>

            <div>
              <label htmlFor="inspector" className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Inspector Responsable *</span>
              </label>
              <input
                id="inspector"
                type="text"
                required
                placeholder="Nombre y apellido del inspector"
                value={inspector}
                onChange={(e) => {
                  setInspector(e.target.value);
                  if (e.target.value.trim()) setValidationError('');
                }}
                className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/20 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Formulario Neutro sin alertas prellenadas ni en vivo */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mt-6">
          <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Conteo Físico de Repuestos
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Ingrese la cantidad encontrada para cada repuesto. El indicador muestra ✅ si cumple el mínimo o ⚠️ si está por debajo.
              </p>
            </div>
            <div className="text-xs text-neutral-500">
              * Diligenciamiento obligatorio de todos los campos (0 es válido)
            </div>
          </div>

          {/* Listado de Repuestos: Borde gris neutro #6B7280, sin colores ni badges de OK/ALERTA en vivo */}
          <div className="mt-5 space-y-3">
            {items.map((it, idx) => {
              const isMissing = missingIndices.has(idx);

              return (
                <div
                  id={`repuesto-item-${idx}`}
                  key={it.repuesto}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isMissing
                      ? 'border-[#DC2626] bg-red-50/40 ring-1 ring-[#DC2626]/20'
                      : 'border-[#6B7280]/40 bg-white hover:border-[#6B7280]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Repuesto info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-[#111827]">
                          {it.repuesto}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>
                          Mínimo requerido: <strong className="text-neutral-800 font-mono">{it.minimo}</strong> {it.und}
                        </span>
                        <span>·</span>
                        <span>Unidad: <strong className="text-neutral-700">{it.und}</strong></span>
                      </div>
                    </div>

                    {/* Numeric Stepper Input Neutro */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {isMissing && (
                        <span className="text-[11px] font-bold text-[#DC2626]">
                          Campo requerido
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStepQuantity(idx, -1)}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors border border-neutral-300 cursor-pointer"
                            aria-label={`Restar 1 a ${it.repuesto}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            step="any"
                            inputMode="numeric"
                            placeholder="—"
                            value={it.cantidad}
                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                            className={`w-20 h-9 text-center text-sm font-bold font-mono tabular-nums rounded-lg focus:outline-none transition-colors ${
                              isMissing
                                ? 'border-2 border-[#DC2626] bg-white text-[#DC2626] focus:ring-2 focus:ring-red-200'
                                : 'border border-[#6B7280] bg-white text-neutral-900 focus:ring-2 focus:ring-[#0D2B4E]/30'
                            }`}
                            aria-label={`Cantidad encontrada para ${it.repuesto}`}
                          />

                          <button
                            type="button"
                            onClick={() => handleStepQuantity(idx, 1)}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors border border-neutral-300 cursor-pointer"
                            aria-label={`Sumar 1 a ${it.repuesto}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Emoticón indicador a la derecha del input */}
                        <div className="w-7 h-9 flex items-center justify-center shrink-0">
                          {(() => {
                            if (it.cantidad.trim() === '') return null;
                            const num = Number(it.cantidad);
                            if (isNaN(num)) return null;
                            if (num >= it.minimo) {
                              return (
                                <span
                                  role="img"
                                  title="Cumple el mínimo"
                                  aria-label="Cumple el mínimo"
                                  className="text-base select-none"
                                >
                                  ✅
                                </span>
                              );
                            } else {
                              return (
                                <span
                                  role="img"
                                  title="Por debajo del mínimo"
                                  aria-label="Por debajo del mínimo"
                                  className="text-base select-none"
                                >
                                  ⚠️
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contador neutro con emoticones al final de la lista */}
          <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Resumen de conteo:</span>
              <span>✅ {cumpleCount}</span>
              <span>·</span>
              <span>⚠️ {alertaCount}</span>
              {pendientesCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-neutral-500">
                    ({pendientesCount} sin diligenciar)
                  </span>
                </>
              )}
            </div>
            <div className="text-neutral-500 text-[11px]">
              {items.length} repuestos requeridos
            </div>
          </div>

          {/* Observaciones Generales (Opcional) */}
          <div className="mt-6 pt-5 border-t border-neutral-200">
            <label htmlFor="observacion" className="block text-xs font-semibold text-neutral-700 mb-1">
              Observaciones Generales de la Inspección (Opcional)
            </label>
            <textarea
              id="observacion"
              rows={2}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Novedades físicas del almacén, repuestos dañados o notas adicionales..."
              className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/20 placeholder:text-neutral-400"
            />
          </div>

          {/* Botón Guardar Inspección: se deshabilita de inmediato durante el envío */}
          <div className="mt-6 pt-5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              <span>Se procesarán los <strong>{items.length}</strong> ítems de <strong>{initialCentro}</strong>.</span>
              <span className="block text-neutral-400 text-[11px] mt-0.5">
                El cálculo de alertas y notificación por correo se ejecutará automáticamente tras guardar.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white shadow-sm transition-all cursor-pointer ${
                isSubmitting
                  ? 'bg-neutral-400 cursor-not-allowed opacity-90'
                  : 'bg-[#0D2B4E] hover:bg-[#0D2B4E]/90 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enviando Inspección...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#F2B705]" />
                  <span>Guardar Inspección</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de Resultado: se muestra ÚNICAMENTE cuando el guardado termina correctamente */}
      {showResultModal && resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-neutral-200 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header del resultado */}
            <div className="text-center pb-4 border-b border-neutral-100">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  resultData.alertaCount > 0 ? 'bg-red-100 text-[#DC2626]' : 'bg-emerald-100 text-[#16A34A]'
                }`}
              >
                {resultData.alertaCount > 0 ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <Check className="w-7 h-7" />
                )}
              </div>

              <h3 className="text-lg font-bold text-[#111827]">
                Resultado de la Inspección · {initialCentro}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Los datos fueron guardados y procesados correctamente en la hoja REPUESTOS.
              </p>
            </div>

            {/* Resumen numérico */}
            <div className="my-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="block text-[11px] text-neutral-500 font-semibold uppercase">Total</span>
                <span className="text-lg font-bold font-mono text-neutral-900">{resultData.total}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="block text-[11px] text-[#16A34A] font-semibold uppercase">OK</span>
                <span className="text-lg font-bold font-mono text-[#16A34A]">{resultData.okCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <span className="block text-[11px] text-[#DC2626] font-semibold uppercase">En Alerta</span>
                <span className="text-lg font-bold font-mono text-[#DC2626]">{resultData.alertaCount}</span>
              </div>
            </div>

            {/* Contenido condicional: con o sin alertas */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              {resultData.alertaCount > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
                    <strong className="block font-bold text-[#DC2626] mb-1">
                      ⚠️ Se notificó por correo al responsable y proveedor:
                    </strong>
                    <div className="text-[11px] font-mono text-neutral-700 space-y-0.5">
                      <div><strong>Para:</strong> {responsableEmail}</div>
                      <div><strong>CC:</strong> {proveedorEmail}, {COPIA_FIJA}</div>
                    </div>
                  </div>

                  <span className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Repuestos en ALERTA ({resultData.alertas.length})
                  </span>

                  <div className="space-y-2">
                    {resultData.alertas.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-red-200 bg-red-50/40 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-neutral-900">{a.repuesto}</div>
                          <div className="text-neutral-500 text-[11px] mt-0.5">
                            Encontrado: <strong>{a.encontrado}</strong> {a.und} · Mínimo: <strong>{a.minimo}</strong> {a.und}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-red-100 text-[#DC2626]">
                            Déficit: -{a.deficit} {a.und}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <ShieldCheck className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#16A34A]">
                    Inspección completa, sin faltantes
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Todos los repuestos requeridos se encuentran en o por encima del stock mínimo requerido. No se emitieron correos de alerta.
                  </p>
                </div>
              )}
            </div>

            {/* Acciones de salida */}
            <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-end">
              {onVolverCentros && (
                <button
                  type="button"
                  onClick={() => {
                    setShowResultModal(false);
                    onVolverCentros();
                  }}
                  className="w-full py-2.5 px-4 bg-[#0D2B4E] hover:bg-[#0D2B4E]/90 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Finalizar y volver a la lista de centros</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
