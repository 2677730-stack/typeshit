exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const {
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      TELEGRAM_CUSTOM_MESSAGE,
      GOOGLE_APPS_SCRIPT_URL
    } = process.env;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const text = [
        TELEGRAM_CUSTOM_MESSAGE || "Новый заказ с сайта VapeTrip",
        "",
        `Дата: ${payload.date || ""}`,
        `Состав: ${payload.orderSummary || ""}`,
        `Сумма: ${payload.total || 0} ₽`,
        `Адрес: ${payload.address || ""}`,
        `Контакт: ${payload.contact || ""}`
      ].join("\n");

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text
        })
      });
    }

    if (GOOGLE_APPS_SCRIPT_URL) {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "order",
          ...payload
        })
      });
    }

    return response(200, { ok: true });
  } catch (error) {
    return response(500, { error: "Order function failed", details: error.message });
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
