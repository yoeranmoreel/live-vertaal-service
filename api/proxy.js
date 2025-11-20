export default async function handler(req, res) {
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxo_jS74zwvOJg_CUPMkD8_NacK2VGbTO-3AwgJFJeb9KWN-4bkG2rf3SrpV3CXExD_A/exec";

  // Preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).send("");
  }

  try {
    const targetUrl = APPS_SCRIPT_URL + req.url.replace("/api/proxy", "");

    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    let text;
    try {
      text = await backendResponse.text();
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: "Unable to read backend response",
      });
    }

    // -------------------------------
    // ❗ FIX: Apps Script kan HTML sturen (429 / errors)
    // -------------------------------
    const contentType = backendResponse.headers.get("content-type") || "";

    // Als GEEN JSON → stuur nette JSON error terug
    if (!contentType.includes("application/json")) {
      console.warn("⚠️ Non-JSON from backend:", text.slice(0, 200));

      return res.status(backendResponse.status).json({
        success: false,
        status: backendResponse.status,
        error:
          backendResponse.status === 429
            ? "Google Apps Script limiet bereikt (429). Probeer later opnieuw."
            : "Backend returned non-JSON response",
      });
    }

    // -------------------------------
    // Alles OK → stuur JSON door
    // -------------------------------
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    return res.status(backendResponse.status).send(text);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Proxy failed: " + err.message,
    });
  }
}
