module.exports = async function handler(req, res) {
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxo_jS74zwvOJg_CUPMkD8_NacK2VGbTO-3AwgJFJeb9KWN-4bkG2rf3SrpV3CXExD_A/exec";

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Clean forwarded URL
  const url = APPS_SCRIPT_URL + req.url.replace("/api", "");

  // Parse body
  let body = undefined;
  if (req.method === "POST") {
    try {
      body = typeof req.body === "object" ? req.body : JSON.parse(req.body);
    } catch {
      body = req.body;
    }
  }

  // Forward request
  let backendResponse;
  try {
    backendResponse = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Proxy fetch failed",
      details: err.message,
    });
  }

  const text = await backendResponse.text();

  try {
    return res.status(backendResponse.status).json(JSON.parse(text));
  } catch {
    return res.status(backendResponse.status).send(text);
  }
};
