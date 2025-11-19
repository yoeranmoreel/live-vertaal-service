export default async function handler(req, res) {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxo_jS74zwvOJg_CUPMkD8_NacK2VGbTO-3AwgJFJeb9KWN-4bkG2rf3SrpV3CXExD_A/exec";

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).send("");
  }

  const url = APPS_SCRIPT_URL + req.url.replace("/api", "");

  const backendResponse = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  });

  const text = await backendResponse.text();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  return res.status(backendResponse.status).send(text);
}
