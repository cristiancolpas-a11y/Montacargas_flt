import { RangeType, RepuestoMinimoItem } from '../types/repuestos';

export const CENTRO_RANGO: Record<string, RangeType> = {
  "Curumaní": "RANGO_2",
  "Fonseca": "RANGO_2",
  "UD CTorices": "RANGO_2",
  "Apartadó": "RANGO_2",
  "Caucasia": "RANGO_2",
  "Magangué": "RANGO_2",
  "Corozal": "RANGO_3_5",
  "Riohacha": "RANGO_3_5",
  "Valledupar": "RANGO_3_5",
  "La Arenosa": "RANGO_3_5",
  "Santa Marta": "RANGO_3_5",
  "Montería": "RANGO_3_5",
  "Cúcuta": "RANGO_6_9",
  "Galapa": "RANGO_6_9",
  "Turbaco": "RANGO_10_MAS"
};

export const CENTROS_LIST: string[] = [
  "Santa Marta",
  "Riohacha",
  "Turbaco",
  "UD CTorices",
  "Galapa",
  "La Arenosa",
  "Cúcuta",
  "Montería",
  "Apartadó",
  "Caucasia",
  "Valledupar",
  "Curumaní",
  "Fonseca",
  "Corozal",
  "Magangué"
];

export const RANGO_DESCRIPCION: Record<RangeType, string> = {
  "RANGO_2": "Hasta 2 Montacargas",
  "RANGO_3_5": "De 3 a 5 Montacargas",
  "RANGO_6_9": "De 6 a 9 Montacargas",
  "RANGO_10_MAS": "10 o más Montacargas"
};

export const RESPONSABLE: Record<string, string> = {
  "Santa Marta": "ricardo.delah@ab-inbev.com",
  "Riohacha": "ricardo.delah@ab-inbev.com",
  "Turbaco": "julian.molina@ab-inbev.com",
  "UD CTorices": "julian.molina@ab-inbev.com",
  "Galapa": "edgar.arrieta@ab-inbev.com",
  "La Arenosa": "edgar.arrieta@ab-inbev.com",
  "Cúcuta": "samanta.blanco@ab-inbev.com",
  "Montería": "ramon.gonzaleza@ab-inbev.com",
  "Apartadó": "ramon.gonzaleza@ab-inbev.com",
  "Caucasia": "ramon.gonzaleza@ab-inbev.com",
  "Valledupar": "juan.martinezb@ab-inbev.com",
  "Curumaní": "juan.martinezb@ab-inbev.com",
  "Fonseca": "juan.martinezb@ab-inbev.com",
  "Corozal": "Jesus.redondo@ab-inbev.com",
  "Magangué": "Jesus.redondo@ab-inbev.com"
};

export const PROVEEDOR: Record<string, string> = {
  "Santa Marta": "Diosnel.villalba@distoyota.com.co",
  "Turbaco": "Diosnel.villalba@distoyota.com.co",
  "UD CTorices": "Diosnel.villalba@distoyota.com.co",
  "Galapa": "Diosnel.villalba@distoyota.com.co",
  "La Arenosa": "Diosnel.villalba@distoyota.com.co",
  "Riohacha": "Jhonatan.rivero@distoyota.com.co",
  "Valledupar": "Jhonatan.rivero@distoyota.com.co",
  "Curumaní": "Jhonatan.rivero@distoyota.com.co",
  "Fonseca": "Jhonatan.rivero@distoyota.com.co",
  "Montería": "Frederich.arteaga@distoyota.com.co",
  "Apartadó": "Frederich.arteaga@distoyota.com.co",
  "Caucasia": "Frederich.arteaga@distoyota.com.co",
  "Corozal": "Frederich.arteaga@distoyota.com.co",
  "Magangué": "Frederich.arteaga@distoyota.com.co",
  "Cúcuta": "Jose.Contreras@cucutamotors.com.co"
};

export const COPIA_FIJA = "Andres.Arroyave@distoyota.com.co,Jesus.redondo@ab-inbev.com";

export const STOCK_POR_RANGO: Record<RangeType, RepuestoMinimoItem[]> = {
  "RANGO_2": [
    { repuesto: "Valvulina", minimo: 1, und: "L" },
    { repuesto: "Aceite Hidráulico", minimo: 20, und: "L" },
    { repuesto: "Líquido de frenos", minimo: 290, und: "ml" },
    { repuesto: "Grasa líquida", minimo: 1, und: "Aerosol" },
    { repuesto: "Refrigerante", minimo: 1, und: "Gal" },
    { repuesto: "ATF", minimo: 4, und: "L" },
    { repuesto: "Desengrasante", minimo: 500, und: "ml" },
    { repuesto: "Superlub", minimo: 1, und: "Aerosol" },
    { repuesto: "Aceite motor", minimo: 1, und: "Gal" },
    { repuesto: "Limpiador de carburador", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de frenos", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de contactos", minimo: 1, und: "Aerosol" },
    { repuesto: "Espejos", minimo: 1, und: "UND" },
    { repuesto: "Kit Led", minimo: 1, und: "KIT" },
    { repuesto: "Pito", minimo: 1, und: "UND" },
    { repuesto: "Bombillo 1F", minimo: 2, und: "UND" },
    { repuesto: "Bombillo 2F", minimo: 2, und: "UND" },
    { repuesto: "Bombillo H3", minimo: 4, und: "UND" },
    { repuesto: "Bombillo de luz baja", minimo: 2, und: "UND" },
    { repuesto: "Alarma de reversa", minimo: 1, und: "UND" },
    { repuesto: "Plumillas", minimo: 1, und: "UND" },
    { repuesto: "Extintor", minimo: 1, und: "UND" },
    { repuesto: "Cinturón de seguridad", minimo: 1, und: "UND" },
    { repuesto: "Kit mangueras central (Juego de mangueras 3 vías y 4 vías)", minimo: 1, und: "KIT" },
    { repuesto: "Kit mangueras segunda sección", minimo: 1, und: "KIT" },
    { repuesto: "Kit manguera de Side Shift (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Kit Manguera de caucho de lona (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Perno rueda trasera", minimo: 1, und: "UND" },
    { repuesto: "Tuerca rueda trasera", minimo: 1, und: "UND" },
    { repuesto: "Pin cacho dirección", minimo: 1, und: "UND" },
  ],
  "RANGO_3_5": [
    { repuesto: "Valvulina", minimo: 1, und: "L" },
    { repuesto: "Aceite Hidráulico", minimo: 20, und: "L" },
    { repuesto: "Líquido de frenos", minimo: 290, und: "ml" },
    { repuesto: "Grasa líquida", minimo: 1, und: "Aerosol" },
    { repuesto: "Refrigerante", minimo: 1, und: "Gal" },
    { repuesto: "ATF", minimo: 4, und: "L" },
    { repuesto: "Desengrasante", minimo: 500, und: "ml" },
    { repuesto: "Superlub", minimo: 1, und: "Aerosol" },
    { repuesto: "Aceite motor", minimo: 1, und: "Gal" },
    { repuesto: "Limpiador de carburador", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de frenos", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de contactos", minimo: 1, und: "Aerosol" },
    { repuesto: "Espejos", minimo: 1, und: "UND" },
    { repuesto: "Kit Led", minimo: 1, und: "KIT" },
    { repuesto: "Pito", minimo: 1, und: "UND" },
    { repuesto: "Bombillo 1F", minimo: 2, und: "UND" },
    { repuesto: "Bombillo 2F", minimo: 2, und: "UND" },
    { repuesto: "Bombillo H3", minimo: 4, und: "UND" },
    { repuesto: "Estroboscópica", minimo: 1, und: "UND" },
    { repuesto: "Alarma de reversa", minimo: 1, und: "UND" },
    { repuesto: "Plumillas", minimo: 1, und: "UND" },
    { repuesto: "Extintor", minimo: 1, und: "UND" },
    { repuesto: "Cinturón de seguridad", minimo: 1, und: "UND" },
    { repuesto: "Kit mangueras central (Juego de mangueras 3 vías y 4 vías)", minimo: 1, und: "KIT" },
    { repuesto: "Kit mangueras segunda sección", minimo: 1, und: "KIT" },
    { repuesto: "Kit manguera de Side Shift (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Kit Manguera de caucho de lona (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Perno rueda trasera", minimo: 1, und: "UND" },
    { repuesto: "Tuerca rueda trasera", minimo: 1, und: "UND" },
    { repuesto: "Pin cacho dirección", minimo: 1, und: "UND" },
    { repuesto: "Deslizadores de freno cascade", minimo: 2, und: "UND" },
  ],
  "RANGO_6_9": [
    { repuesto: "Valvulina", minimo: 2, und: "L" },
    { repuesto: "Aceite Hidráulico", minimo: 20, und: "L" },
    { repuesto: "Líquido de frenos", minimo: 290, und: "ml" },
    { repuesto: "Grasa líquida", minimo: 1, und: "Aerosol" },
    { repuesto: "Refrigerante", minimo: 1, und: "Gal" },
    { repuesto: "ATF", minimo: 5, und: "L" },
    { repuesto: "Desengrasante", minimo: 500, und: "ml" },
    { repuesto: "Superlub", minimo: 1, und: "Aerosol" },
    { repuesto: "Aceite motor", minimo: 1, und: "Gal" },
    { repuesto: "Limpiador de carburador", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de frenos", minimo: 1, und: "Aerosol" },
    { repuesto: "Limpiador de contactos", minimo: 1, und: "Aerosol" },
    { repuesto: "Espejos", minimo: 1, und: "UND" },
    { repuesto: "Kit Led", minimo: 1, und: "UND" },
    { repuesto: "Pito", minimo: 1, und: "UND" },
    { repuesto: "Bombillo 1F", minimo: 3, und: "UND" },
    { repuesto: "Bombillo 2F", minimo: 3, und: "UND" },
    { repuesto: "Bombillo H3 (Según modelo del equipo)", minimo: 5, und: "UND" },
    { repuesto: "Estroboscópica", minimo: 1, und: "UND" },
    { repuesto: "Alarma de reversa", minimo: 1, und: "UND" },
    { repuesto: "Plumillas", minimo: 1, und: "UND" },
    { repuesto: "Extintor", minimo: 1, und: "UND" },
    { repuesto: "Cinturón de seguridad", minimo: 2, und: "UND" },
    { repuesto: "Kit mangueras central (Juego de mangueras 3 vías y 4 vías)", minimo: 1, und: "KIT" },
    { repuesto: "Kit mangueras segunda sección", minimo: 1, und: "KIT" },
    { repuesto: "Kit manguera de Side Shift (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Kit Manguera de caucho de lona (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Válvula de gas delantera (sistema original)", minimo: 1, und: "UND" },
    { repuesto: "Válvula de gas trasera (sistema original)", minimo: 1, und: "UND" },
    { repuesto: "Empaquetadura de gas original", minimo: 1, und: "UND" },
    { repuesto: "Empaquetadura de gas lovato (sistema local)", minimo: 1, und: "UND" },
    { repuesto: "Perno rueda trasera", minimo: 4, und: "UND" },
    { repuesto: "Tuerca rueda trasera", minimo: 4, und: "UND" },
    { repuesto: "Pin cacho dirección", minimo: 1, und: "UND" },
    { repuesto: "Deslizadores de freno cascade", minimo: 2, und: "UND" },
    { repuesto: "Luz perimetral roja", minimo: 1, und: "UND" },
  ],
  "RANGO_10_MAS": [
    { repuesto: "Valvulina", minimo: 2, und: "L" },
    { repuesto: "Aceite Hidráulico", minimo: 20, und: "L" },
    { repuesto: "Líquido de frenos", minimo: 290, und: "ml" },
    { repuesto: "Grasa líquida", minimo: 2, und: "Aerosol" },
    { repuesto: "Refrigerante", minimo: 2, und: "Gal" },
    { repuesto: "ATF", minimo: 5, und: "L" },
    { repuesto: "Desengrasante", minimo: 1000, und: "ml" },
    { repuesto: "Superlub", minimo: 2, und: "Aerosol" },
    { repuesto: "Aceite motor", minimo: 2, und: "Gal" },
    { repuesto: "Limpiador de carburador", minimo: 2, und: "Aerosol" },
    { repuesto: "Limpiador de frenos", minimo: 2, und: "Aerosol" },
    { repuesto: "Limpiador de contactos", minimo: 2, und: "Aerosol" },
    { repuesto: "Espejos", minimo: 2, und: "UND" },
    { repuesto: "Kit Led", minimo: 2, und: "UND" },
    { repuesto: "Pito", minimo: 1, und: "UND" },
    { repuesto: "Bombillo 1F", minimo: 5, und: "UND" },
    { repuesto: "Bombillo 2F", minimo: 5, und: "UND" },
    { repuesto: "Bombillo H3 (Según modelo equipo)", minimo: 6, und: "UND" },
    { repuesto: "Estroboscópica", minimo: 2, und: "UND" },
    { repuesto: "Alarma de reversa", minimo: 2, und: "UND" },
    { repuesto: "Plumillas", minimo: 1, und: "UND" },
    { repuesto: "Extintor", minimo: 2, und: "UND" },
    { repuesto: "Cinturón de seguridad", minimo: 3, und: "UND" },
    { repuesto: "Kit mangueras central (Juego de mangueras 3 vías y 4 vías)", minimo: 1, und: "KIT" },
    { repuesto: "Kit mangueras segunda sección", minimo: 1, und: "KIT" },
    { repuesto: "Kit manguera de Side Shift (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Kit Manguera de caucho de lona (2 mangueras)", minimo: 1, und: "KIT" },
    { repuesto: "Válvula de gas delantera (sistema original)", minimo: 1, und: "UND" },
    { repuesto: "Válvula de gas trasera (sistema original)", minimo: 1, und: "UND" },
    { repuesto: "Empaquetadura de gas (sistema original)", minimo: 1, und: "UND" },
    { repuesto: "Empaquetadura de gas lovato (sistema local)", minimo: 1, und: "UND" },
    { repuesto: "Perno rueda trasera", minimo: 4, und: "UND" },
    { repuesto: "Tuerca rueda trasera", minimo: 4, und: "UND" },
    { repuesto: "Pin cacho dirección", minimo: 2, und: "UND" },
    { repuesto: "Deslizadores de freno cascade", minimo: 2, und: "UND" },
    { repuesto: "Luz perimetral roja", minimo: 1, und: "UND" },
  ],
};

export const GAS_SCRIPT_CODE = `/**
 * @file Code.gs
 * Google Apps Script para Módulo INVENTARIO REPUESTOS MONTACARGAS
 * Desplegar desde: soporte.regionalnorte@fleetmanagement-rn.com
 * Tipo de proyecto: Aplicación Web (Web App)
 */

var ID_HOJA = "1lKiLDeMo7obOi580NUfGxNrcLf7fj5UO66xIQ4dX7oI";

var RESPONSABLE = {
  "Santa Marta": "ricardo.delah@ab-inbev.com",
  "Riohacha": "ricardo.delah@ab-inbev.com",
  "Turbaco": "julian.molina@ab-inbev.com",
  "UD CTorices": "julian.molina@ab-inbev.com",
  "Galapa": "edgar.arrieta@ab-inbev.com",
  "La Arenosa": "edgar.arrieta@ab-inbev.com",
  "Cúcuta": "samanta.blanco@ab-inbev.com",
  "Montería": "ramon.gonzaleza@ab-inbev.com",
  "Apartadó": "ramon.gonzaleza@ab-inbev.com",
  "Caucasia": "ramon.gonzaleza@ab-inbev.com",
  "Valledupar": "juan.martinezb@ab-inbev.com",
  "Curumaní": "juan.martinezb@ab-inbev.com",
  "Fonseca": "juan.martinezb@ab-inbev.com",
  "Corozal": "Jesus.redondo@ab-inbev.com",
  "Magangué": "Jesus.redondo@ab-inbev.com"
};

var PROVEEDOR = {
  "Santa Marta": "Diosnel.villalba@distoyota.com.co",
  "Turbaco": "Diosnel.villalba@distoyota.com.co",
  "UD CTorices": "Diosnel.villalba@distoyota.com.co",
  "Galapa": "Diosnel.villalba@distoyota.com.co",
  "La Arenosa": "Diosnel.villalba@distoyota.com.co",
  "Riohacha": "Jhonatan.rivero@distoyota.com.co",
  "Valledupar": "Jhonatan.rivero@distoyota.com.co",
  "Curumaní": "Jhonatan.rivero@distoyota.com.co",
  "Fonseca": "Jhonatan.rivero@distoyota.com.co",
  "Montería": "Frederich.arteaga@distoyota.com.co",
  "Apartadó": "Frederich.arteaga@distoyota.com.co",
  "Caucasia": "Frederich.arteaga@distoyota.com.co",
  "Corozal": "Frederich.arteaga@distoyota.com.co",
  "Magangué": "Frederich.arteaga@distoyota.com.co",
  "Cúcuta": "Jose.Contreras@cucutamotors.com.co"
};

var COPIA_FIJA = "Andres.Arroyave@distoyota.com.co,Jesus.redondo@ab-inbev.com";

function doGet(e) {
  try {
    var docId = (e && e.parameter && e.parameter.docId) ? cleanId(e.parameter.docId) : ID_HOJA;
    var sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : "REPUESTOS";
    var ss = SpreadsheetApp.openById(docId);
    var s = getSheetByGid(ss, "0") || findSheetCaseInsensitive(ss, sheetName) || ss.getSheetByName(sheetName) || ss.getSheets()[0];
    
    if (!s) {
      return output("error", "Hoja REPUESTOS no encontrada");
    }

    var data = s.getDataRange().getValues();
    return output("success", "Datos leídos correctamente", data);
  } catch (err) {
    return output("error", "Error leyendo hoja: " + err.toString());
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    hasLock = lock.tryLock(30000);
  } catch (lockErr) {
    return output("error", "Error de concurrencia al solicitar bloqueo: " + lockErr.toString());
  }

  if (!hasLock) {
    return output("error", "Servidor ocupado. No se obtuvo el candado de escritura.");
  }

  try {
    var raw = e && e.postData ? e.postData.contents : "";
    var body = {};
    try {
      body = JSON.parse(raw);
    } catch (parseErr) {
      body = e.parameter || {};
    }

    var method = body.method || (body.data && body.data.method);
    var d = body.data || body;

    if (method === "POST_REPUESTO_FLT_INSPECCION") {
      var ss = SpreadsheetApp.openById(cleanId(d.docId) || ID_HOJA);
      var s = getSheetByGid(ss, "0") || findSheetCaseInsensitive(ss, "REPUESTOS") || ss.getSheetByName("REPUESTOS") || ss.getSheets()[0];
      
      if (!s) {
        return output("error", "Hoja REPUESTOS no encontrada en el documento");
      }

      if (s.getLastRow() === 0) {
        s.appendRow([
          "FECHA",
          "CENTRO",
          "INSPECTOR",
          "REPUESTO",
          "CANTIDAD ENCONTRADA",
          "MINIMO REQUERIDO",
          "UND",
          "ESTADO",
          "OBSERVACION"
        ]);
      }

      var fechaConHora = d.fechaHora || d.fecha || todayDateTime();
      var centro = (d.centro || "").toString().trim();
      var inspector = (d.inspector || "").toString().trim();
      var items = d.items || [];
      var observacion = (d.observacion || "").toString().trim();

      if (!items || !items.length) {
        return output("error", "Inspección sin ítems recibidos");
      }

      var alertas = [];
      var filas = [];

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var cant = Number(it.cantidad != null ? it.cantidad : 0);
        var min = Number(it.minimo != null ? it.minimo : 0);
        var estado = (cant < min) ? "ALERTA" : "OK";
        var repuestoNom = (it.repuesto || "").toString().trim();
        var und = (it.und || "").toString().trim();

        filas.push([
          fechaConHora,
          centro,
          inspector,
          repuestoNom,
          cant,
          min,
          und,
          estado,
          observacion
        ]);

        if (estado === "ALERTA") {
          alertas.push({
            repuesto: repuestoNom,
            cantidad: cant,
            minimo: min,
            und: und,
            faltan: (min - cant)
          });
        }
      }

      s.getRange(s.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);

      if (alertas.length > 0) {
        try {
          enviarCorreoRepuestoFlt(centro, inspector, fechaConHora, alertas, items);
        } catch (mailErr) {
          Logger.log("Advertencia enviando correo: " + mailErr.toString());
        }
      }

      return output("success", "Inspección guardada con éxito. Filas escritas: " + filas.length + ". Alertas: " + alertas.length, {
        total: filas.length,
        alertas: alertas.length,
        okCount: (filas.length - alertas.length),
        fecha: fechaConHora,
        centro: centro
      });
    }

    return output("error", "Método no reconocido: " + method);
  } catch (err) {
    return output("error", "Error interno en el servidor: " + err.toString());
  } finally {
    try {
      lock.releaseLock();
    } catch (relErr) {
      Logger.log("Error liberando lock: " + relErr.toString());
    }
  }
}

function enviarCorreoRepuestoFlt(centro, inspector, fecha, alertas, items) {
  centro = centro || "Santa Marta";
  inspector = inspector || "Inspector";
  fecha = fecha || todayDateTime();
  if (!alertas || !Array.isArray(alertas) || alertas.length === 0) {
    alertas = [
      { repuesto: "Aceite Hidráulico ISO 68", cantidad: 0, minimo: 2, und: "GLN", faltan: 2 }
    ];
  }
  items = (items && Array.isArray(items)) ? items : [];

  var to = RESPONSABLE[centro] || COPIA_FIJA;
  var ccArr = [];
  if (PROVEEDOR[centro]) {
    ccArr.push(PROVEEDOR[centro]);
  }
  ccArr.push(COPIA_FIJA);
  var cc = ccArr.join(",");

  var filasHtml = "";
  for (var i = 0; i < alertas.length; i++) {
    var a = alertas[i];
    filasHtml += '<tr style="background:#fdecec;">' +
      '<td style="padding:8px 12px;border:1px solid #ddd;font-weight:600;color:#111827;">' + escapeHtml(a.repuesto) + '</td>' +
      '<td style="padding:8px 12px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#111827;">' + Number(a.cantidad) + '</td>' +
      '<td style="padding:8px 12px;border:1px solid #ddd;text-align:center;color:#4b5563;">' + Number(a.minimo) + '</td>' +
      '<td style="padding:8px 12px;border:1px solid #ddd;text-align:center;color:#4b5563;">' + escapeHtml(a.und || "") + '</td>' +
      '<td style="padding:8px 12px;border:1px solid #ddd;text-align:center;color:#dc2626;font-weight:bold;">' + Number(a.faltan) + '</td>' +
      '</tr>';
  }

  var html = '<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1f2937;">' +
    '<div style="background:#0D2B4E;padding:16px 20px;border-radius:8px 8px 0 0;color:#fff;">' +
      '<span style="font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#F2B705;">Sección Montacargas · Fleet Management</span>' +
      '<h2 style="margin:4px 0 0 0;font-size:18px;color:#fff;">⚠️ Alerta de Stock de Repuestos - ' + escapeHtml(centro) + '</h2>' +
    '</div>' +
    '<div style="padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;background:#ffffff;">' +
      '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.5;">' +
        'Se ha registrado una inspección el <b>' + escapeHtml(fecha) + '</b> por el inspector <b>' + escapeHtml(inspector || "N/D") + '</b> en el centro <b>' + escapeHtml(centro) + '</b>. ' +
        'Se detectaron <b>' + alertas.length + '</b> repuestos por debajo del stock mínimo requerido:' +
      '</p>' +
      '<table style="border-collapse:collapse;width:100%;font-size:13px;margin:16px 0;">' +
        '<thead>' +
          '<tr style="background:#0D2B4E;color:#ffffff;">' +
            '<th style="padding:10px 12px;border:1px solid #0D2B4E;text-align:left;">Repuesto</th>' +
            '<th style="padding:10px 12px;border:1px solid #0D2B4E;text-align:center;">Encontrado</th>' +
            '<th style="padding:10px 12px;border:1px solid #0D2B4E;text-align:center;">Mínimo</th>' +
            '<th style="padding:10px 12px;border:1px solid #0D2B4E;text-align:center;">Und</th>' +
            '<th style="padding:10px 12px;border:1px solid #0D2B4E;text-align:center;">Déficit (Faltan)</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + filasHtml + '</tbody>' +
      '</table>' +
      '<p style="color:#6b7280;font-size:12px;margin:24px 0 0 0;border-top:1px solid #e5e7eb;padding-top:12px;">' +
        'Este correo ha sido emitido automáticamente por el sistema de control de flota de montacargas.<br>' +
        '<b>Soporte Regional Norte · Fleet Management</b> (soporte.regionalnorte@fleetmanagement-rn.com)' +
      '</p>' +
    '</div>' +
  '</div>';

  try {
    GmailApp.sendEmail(
      to,
      "⚠️ Alerta stock repuestos Montacargas - " + centro,
      "Este correo requiere un lector compatible con HTML.",
      {
        cc: cc,
        htmlBody: html
      }
    );
    Logger.log("Correo enviado exitosamente con GmailApp a: " + to + " (CC: " + cc + ")");
  } catch (gmailErr) {
    Logger.log("Aviso: Falló GmailApp (" + gmailErr.toString() + "). Intentando con MailApp...");
    MailApp.sendEmail({
      to: to,
      cc: cc,
      subject: "⚠️ Alerta stock repuestos Montacargas - " + centro,
      htmlBody: html
    });
    Logger.log("Correo enviado con MailApp a: " + to);
  }
}

function testEnviarCorreo() {
  var centroPrueba = "Santa Marta";
  var testAlertas = [
    { repuesto: "Aceite Hidráulico ISO 68", cantidad: 0, minimo: 2, und: "GLN", faltan: 2 },
    { repuesto: "Filtro Aceite Motor", cantidad: 1, minimo: 3, und: "UND", faltan: 2 }
  ];
  Logger.log("Ejecutando prueba de envío de correo para " + centroPrueba + "...");
  enviarCorreoRepuestoFlt(centroPrueba, "Inspector de Prueba", todayDateTime(), testAlertas, []);
  Logger.log("Prueba completada con éxito. Revisa el correo de " + (RESPONSABLE[centroPrueba] || COPIA_FIJA));
}

function escapeHtml(text) {
  if (text == null) return "";
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

function output(status, message, data) {
  var res = { status: status, message: message };
  if (data !== undefined) {
    res.data = data;
  }
  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetByGid(spreadsheet, gid) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId().toString() === gid.toString()) {
      return sheets[i];
    }
  }
  return null;
}

function findSheetCaseInsensitive(spreadsheet, name) {
  var target = (name || "").toLowerCase().trim();
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().trim() === target) {
      return sheets[i];
    }
  }
  return null;
}

function cleanId(id) {
  if (!id) return "";
  return id.toString().trim();
}

function todayDateTime() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "America/Bogota", "yyyy-MM-dd HH:mm:ss");
}

function today() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "America/Bogota", "yyyy-MM-dd");
}
`;
