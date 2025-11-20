export default async function handler(req, res) {
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyxo_jS74zwvOJg_CUPMkD8_NacK2VGbTO-3AwgJFJeb9KWN-4bkG2rf3SrpV3CXExD_A/exec";

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).send("");
    return;
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
      return res.status(500).json({ success: false, error: "Unable to read backend response" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    res.status(backendResponse.status).send(text);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Proxy failed: " + err.message,
    });
  }
}
