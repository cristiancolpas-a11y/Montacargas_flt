/**
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

/**
 * Endpoint GET: devuelve todas las filas de la hoja REPUESTOS para el dashboard.
 */
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

/**
 * Endpoint POST: guarda una inspección completa y envía correos si hay alertas.
 */
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

      // Si la hoja está totalmente vacía, crear encabezados oficiales
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

      // Guardar fecha con hora (yyyy-MM-dd HH:mm:ss) para distinguir inspecciones
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

      // Escritura atómica de todas las filas con un único setValues
      s.getRange(s.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);

      // Si hay alertas, enviar correo protegido con try/catch para no invalidar el guardado
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

/**
 * Envía correo HTML con formato formal y textos escapados para seguridad.
 */
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

/**
 * Función de prueba para autorizar permisos de Gmail y validar el envío.
 * Selecciona esta función en el desplegable de arriba en Google Apps Script y haz clic en 'Ejecutar'.
 */
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

/**
 * Escapa caracteres HTML para evitar inyecciones.
 */
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

/**
 * Respuesta formateada JSON para web apps de GAS.
 */
function output(status, message, data) {
  var res = { status: status, message: message };
  if (data !== undefined) {
    res.data = data;
  }
  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Busca una hoja por su gid numérico o en texto.
 */
function getSheetByGid(spreadsheet, gid) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId().toString() === gid.toString()) {
      return sheets[i];
    }
  }
  return null;
}

/**
 * Busca hoja ignorando mayúsculas/minúsculas y espacios.
 */
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

/**
 * Limpia identificadores.
 */
function cleanId(id) {
  if (!id) return "";
  return id.toString().trim();
}

/**
 * Devuelve la fecha y hora actual en formato yyyy-MM-dd HH:mm:ss
 */
function todayDateTime() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "America/Bogota", "yyyy-MM-dd HH:mm:ss");
}

/**
 * Devuelve solo la fecha en formato yyyy-MM-dd
 */
function today() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "America/Bogota", "yyyy-MM-dd");
}

/*
 ============================================================================
 INSTRUCCIONES DE DESPLIEGUE:
 1. Abrir Google Sheets (docId: 1lKiLDeMo7obOi580NUfGxNrcLf7fj5UO66xIQ4dX7oI).
 2. Ir a Extensiones > Apps Script con la cuenta:
    soporte.regionalnorte@fleetmanagement-rn.com
 3. Pegar este código íntegro reemplazando el contenido de Code.gs.
 4. Clic en "Implementar" > "Nueva implementación".
 5. Tipo: "Aplicación web".
    - Descripción: "Backend Repuestos Montacargas FLT"
    - Ejecutar como: "Yo" (soporte.regionalnorte@fleetmanagement-rn.com)
    - Quién tiene acceso: "Cualquier persona" (Anyone)
 6. Clic en "Implementar" y autorizar los permisos requeridos (Hojas de cálculo y Envío de correo).
 7. Copiar la URL generada terminada en /exec y pegarla en el campo REPUESTOS_FLT_SCRIPT_URL
    dentro de services/sheetService.ts (o en la ventana de configuración del applet).
 ============================================================================
*/
