import React, { useState, useEffect, useCallback } from 'react';
import { PinGate } from './components/PinGate';
import { Navbar } from './components/Navbar';
import { CentrosGrid } from './components/CentrosGrid';
import { RegistroView } from './components/RegistroView';
import { ScriptConfigModal } from './components/ScriptConfigModal';
import { fetchRepuestoFltFromSheet } from './services/sheetService';
import { InspectionRecord } from './types/repuestos';
import { CENTROS_LIST } from './constants/repuestosData';

export default function App() {
  // Security PIN gate state (Clave 1506) - asks every time entering the module
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Navigation state: 'centros' | 'formulario'
  const [vista, setVista] = useState<'centros' | 'formulario'>('centros');

  // Selected Centro
  const [selectedCentro, setSelectedCentro] = useState<string>(CENTROS_LIST[0]);

  // Inspection Records from Sheet / GAS
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Settings / Apps Script Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRepuestoFltFromSheet();
      setRecords(data);
    } catch (err) {
      console.error('Error cargando repuestos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load when unlocked
  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked, loadData]);

  // Handle lock / logout (resets to PIN and centros)
  const handleLock = () => {
    setIsUnlocked(false);
    setVista('centros');
  };

  // If locked, render PIN Gate (asks 1506 each time)
  if (!isUnlocked) {
    return <PinGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F3F5] text-neutral-900 flex flex-col font-sans">
      {/* Top Header / Navigation Bar */}
      <Navbar
        vista={vista}
        selectedCentro={selectedCentro}
        onNavigateHome={() => setVista('centros')}
        onLock={handleLock}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={loadData}
        isRefreshing={isLoading}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (!records || records.length === 0) ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#0D2B4E]/30 border-t-[#0D2B4E] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#0D2B4E]">
              Consultando hoja REPUESTOS...
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Leyendo datos reales del documento
            </p>
          </div>
        ) : vista === 'centros' ? (
          /* Nivel 1: Lista vertical de 15 centros */
          <CentrosGrid
            records={records}
            onSelectCentro={(centro) => {
              setSelectedCentro(centro);
              setVista('formulario');
            }}
          />
        ) : (
          /* Nivel 2: Formulario de inspección del centro seleccionado */
          <RegistroView
            initialCentro={selectedCentro}
            onInspectionSaved={(savedCentro) => {
              setSelectedCentro(savedCentro);
              loadData();
            }}
            onVolverCentros={() => setVista('centros')}
          />
        )}
      </main>

      {/* Backend Apps Script & URL Config Modal */}
      <ScriptConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUrlUpdated={loadData}
      />
    </div>
  );
}
