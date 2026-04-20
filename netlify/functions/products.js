exports.handler = async function() {
  const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

  if (!GOOGLE_APPS_SCRIPT_URL) {
    return response(500, { error: "GOOGLE_APPS_SCRIPT_URL is not configured", products: [] });
  }

  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.set("action", "products");
    url.searchParams.set("t", Date.now().toString());

    const upstream = await fetch(url.toString(), { method: "GET" });
    const text = await upstream.text();

    let payload = {};
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { products: [] };
    }

    if (!upstream.ok) {
      return response(upstream.status, { error: "Apps Script returned an error", details: payload, products: [] });
    }

    return response(200, { products: Array.isArray(payload.products) ? payload.products : [] });
  } catch (error) {
    return response(500, { error: "Failed to load products", details: error.message, products: [] });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}
