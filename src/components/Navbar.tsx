import React from 'react';
import { Lock, Settings, RefreshCw, ArrowLeft, Building2 } from 'lucide-react';

interface NavbarProps {
  vista: 'centros' | 'formulario';
  selectedCentro?: string;
  onNavigateHome: () => void;
  onLock: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  vista,
  selectedCentro,
  onNavigateHome,
  onLock,
  onOpenSettings,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="bg-[#0D2B4E] text-white border-b border-[#0D2B4E]/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark / Module Title */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
            title="Ir al inicio de centros"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F2B705] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="font-black text-xs text-[#0D2B4E]">FLT</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-[#F2B705] font-semibold tracking-wide uppercase">
                <span>Montacargas</span>
                <span className="text-neutral-400">/</span>
                <span>Regional Norte</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-neutral-200 transition-colors">
                Inventario Repuestos
              </h1>
            </div>
          </div>

          {/* Zone 2: Current Context Badge */}
          <div className="hidden sm:flex items-center">
            {vista === 'centros' ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/10 text-neutral-300 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>15 Centros de Distribución</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10 cursor-pointer"
                title="Volver a la lista de centros"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Centro: {selectedCentro}</span>
                <span className="text-white/40">|</span>
                <span className="text-neutral-300 font-normal">Cambiar centro</span>
              </button>
            )}
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar datos desde la hoja"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              title="Configuración de Apps Script y Envíos"
              className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-white/20 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={onLock}
              title="Bloquear módulo"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bloquear</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
