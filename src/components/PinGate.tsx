import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, AlertCircle, Delete, KeyRound, Truck } from 'lucide-react';

interface PinGateProps {
  onUnlock: () => void;
}

export const PinGate: React.FC<PinGateProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const CORRECT_PIN = '1506';

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      setErrorMessage('');

      if (nextPin.length === 4) {
        if (nextPin === CORRECT_PIN) {
          onUnlock();
        } else {
          setError(true);
          setErrorMessage('Clave incorrecta. Acceso denegado.');
          setTimeout(() => {
            setPin('');
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(false);
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="min-h-screen bg-[#F1F3F5] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0D2B4E] px-6 py-7 text-center text-white relative">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Lock className="w-7 h-7 text-[#F2B705]" />
          </div>
          <span className="text-xs uppercase tracking-wider text-[#F2B705] font-semibold">
            Sección Montacargas
          </span>
          <h1 className="text-lg font-bold text-white mt-1">
            Inventario de Repuestos
          </h1>
          <p className="text-xs text-neutral-300 mt-1">
            Módulo restringido · Control de Stock y Mínimos
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-xs text-neutral-600 font-medium mb-3">
              Ingrese el PIN de seguridad de 4 dígitos para acceder
            </p>

            {/* PIN Dots Indicator */}
            <div className="flex justify-center items-center gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-150 ${
                      error
                        ? 'bg-[#DC2626] scale-110'
                        : isFilled
                        ? 'bg-[#0D2B4E] scale-110'
                        : 'border-2 border-neutral-300 bg-neutral-100'
                    }`}
                  />
                );
              })}
            </div>

            {error ? (
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#DC2626] font-medium mt-3">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <div className="h-5 mt-3" />
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-12 rounded-lg bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 text-lg font-semibold text-[#111827] border border-neutral-200 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/30"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-lg bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 text-xs font-medium text-neutral-600 border border-neutral-200 transition-colors shadow-2xs focus:outline-none"
            >
              Borrar
            </button>

            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 rounded-lg bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 text-lg font-semibold text-[#111827] border border-neutral-200 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0D2B4E]/30"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-lg bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 flex items-center justify-center text-neutral-600 border border-neutral-200 transition-colors shadow-2xs focus:outline-none"
              aria-label="Retroceder"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Info */}
          <div className="border-t border-neutral-100 pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Protección activa por centro y sesión</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-neutral-500">
        Fleet Management · Soporte Regional Norte
      </div>
    </div>
  );
};
