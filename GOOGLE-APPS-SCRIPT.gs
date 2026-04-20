function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'products') {
    return jsonResponse({ products: getProducts_() });
  }

  return jsonResponse({ ok: true, message: 'Apps Script is working' });
}

function doPost(e) {
  var data = parseBody_(e);
  var action = data.action || '';

  if (action === 'order') {
    saveOrder_(data);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ ok: false, error: 'Unknown action' });
}

function getProducts_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(String);
  var rows = values.slice(1);

  return rows
    .filter(function(row) {
      var active = getCell_(headers, row, 'active');
      return String(active || '').toLowerCase() !== 'false' && String(active || '') !== '0';
    })
    .map(function(row) {
      return {
        id: String(getCell_(headers, row, 'id') || Utilities.getUuid()),
        name: String(getCell_(headers, row, 'name') || ''),
        category: String(getCell_(headers, row, 'category') || 'other'),
        categoryLabel: String(getCell_(headers, row, 'categoryLabel') || ''),
        subcategory: String(getCell_(headers, row, 'subcategory') || ''),
        subcategoryLabel: String(getCell_(headers, row, 'subcategoryLabel') || ''),
        price: Number(getCell_(headers, row, 'price') || 0),
        stock: Number(getCell_(headers, row, 'stock') || 0),
        description: String(getCell_(headers, row, 'description') || ''),
        image: String(getCell_(headers, row, 'image') || ''),
        gallery: String(getCell_(headers, row, 'gallery') || '')
      };
    })
    .filter(function(item) { return item.name; });
}

function saveOrder_(data) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('Orders') || spreadsheet.insertSheet('Orders');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['date', 'orderSummary', 'address', 'contact', 'total', 'status']);
  }

  sheet.appendRow([
    data.date || new Date().toLocaleString(),
    data.orderSummary || '',
    data.address || '',
    data.contact || '',
    data.total || 0,
    'paid'
  ]);
}

function parseBody_(e) {
  try {
    return JSON.parse(e.postData.contents || '{}');
  } catch (error) {
    return {};
  }
}

function getCell_(headers, row, key) {
  var index = headers.indexOf(key);
  return index >= 0 ? row[index] : '';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
