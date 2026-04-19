exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const expectedPassword = process.env.ADMIN_PANEL_PASSWORD;

    if (!expectedPassword) {
      return response(500, { error: "ADMIN_PANEL_PASSWORD is not configured" });
    }

    if (body.password !== expectedPassword) {
      return response(401, { error: "Invalid password" });
    }

    return response(200, { ok: true });
  } catch (error) {
    return response(500, { error: "Admin auth failed", details: error.message });
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
