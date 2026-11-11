import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { CENTROS_LIST } from '../constants/repuestosData';
import { InspectionRecord } from '../types/repuestos';

interface CentrosGridProps {
  onSelectCentro: (centro: string) => void;
  onVolver?: () => void;
  title?: string;
  subtitle?: string;
  records?: InspectionRecord[];
}

export const CentrosGrid: React.FC<CentrosGridProps> = ({
  onSelectCentro,
  onVolver,
  title = "Selecciona el centro",
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Contenedor centrado con max-width de 480px */}
      <div className="w-full max-w-[480px] px-2 sm:px-0">
        
        {/* Encima de la lista: título centrado y botón Volver si aplica */}
        <div className="mb-6 relative flex flex-col items-center text-center">
          {onVolver && (
            <div className="w-full flex items-center justify-start mb-3">
              <button
                type="button"
                onClick={onVolver}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/30"
                aria-label="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Volver</span>
              </button>
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Seleccione el centro para realizar la inspección de repuestos
          </p>
        </div>

        {/* Lista vertical de una sola columna: Tarjetas apiladas con separación de 14px */}
        <div className="flex flex-col gap-[14px]">
          {CENTROS_LIST.map((centro) => {
            return (
              <button
                key={centro}
                type="button"
                onClick={() => onSelectCentro(centro)}
                aria-label={`Abrir formulario de inspección para ${centro}`}
                className="group relative w-full h-[56px] rounded-[14px] bg-[#0D2B4E] text-white shadow-sm flex items-center justify-between px-5 transition-all duration-200 cursor-pointer select-none border-b-0 hover:-translate-y-[2px] hover:shadow-md hover:border-b-[3px] hover:border-b-[#F2B705] focus:outline-none focus:-translate-y-[2px] focus:shadow-md focus:border-b-[3px] focus:border-b-[#F2B705] active:scale-[0.98]"
              >
                {/* Espaciador izquierdo invisible para mantener el nombre perfectamente centrado */}
                <div className="w-5 shrink-0" aria-hidden="true" />

                {/* Nombre del centro: centrado horizontal y verticalmente, semibold, 15-16px, blanco */}
                <span className="flex-1 text-center font-semibold text-[15px] sm:text-[16px] tracking-wide text-white truncate px-2">
                  {centro}
                </span>

                {/* Pequeño icono decorativo de tres puntos verticales (⋮) en blanco con 60% de opacidad */}
                <div
                  className="w-5 flex items-center justify-end shrink-0 text-white/60 group-hover:text-white/90 transition-opacity"
                  aria-hidden="true"
                >
                  <MoreVertical className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Pie informativo sutil */}
        <div className="text-center text-[11px] text-neutral-400 mt-6 pb-4">
          15 centros disponibles
        </div>
      </div>
    </div>
  );
};
