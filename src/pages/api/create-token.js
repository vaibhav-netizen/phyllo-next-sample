// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const PHYLLO_CREATE_TOKEN_URL = "https://api.sandbox.getphyllo.com/v1/sdk-tokens";
const PHYLLO_CLIENT_ID = process.env.PHYLLO_CLIENT_ID;
const PHYLLO_SECRET_ID = process.env.PHYLLO_SECRET_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Node-compatible Basic Auth header
    const auth = Buffer.from(`${PHYLLO_CLIENT_ID}:${PHYLLO_SECRET_ID}`).toString("base64");

    const headers = {
      "Authorization": "Basic " + auth,
      "Content-Type": "application/json",
    };

    const response = await fetch(PHYLLO_CREATE_TOKEN_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    console.log("req.body:", req.body);
    
    const data = await response.json();

    console.log("SDK token created:", data);

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Error creating SDK token:", err);
    return res.status(500).json({ error: "Failed to create SDK token" });
  }
}
