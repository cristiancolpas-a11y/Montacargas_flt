export type RangeType = 'RANGO_2' | 'RANGO_3_5' | 'RANGO_6_9' | 'RANGO_10_MAS';

export interface RepuestoMinimoItem {
  repuesto: string;
  minimo: number;
  und: string;
}

export interface RepuestoFormItem {
  repuesto: string;
  cantidad: string; // Inicialmente vacía: string vacía '' o número como string
  minimo: number;
  und: string;
}

export interface InspectionRecord {
  fecha: string;
  centro: string;
  inspector: string;
  repuesto: string;
  cantidad: number;
  minimo: number;
  und: string;
  estado: 'OK' | 'ALERTA';
  observacion?: string;
}

export interface CenterStockSummary {
  centro: string;
  rango: RangeType;
  fecha: string;
  inspector: string;
  total: number;
  okCount: number;
  alertaCount: number;
  cumplimiento: number;
  items: InspectionRecord[];
  faltantes: {
    repuesto: string;
    cantidad: number;
    minimo: number;
    und: string;
    faltan: number;
  }[];
}
