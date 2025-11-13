// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// const PHYLLO_GET_ACCOUNTS_URL = "https://api.sandbox.getphyllo.com/v1/accounts";
// const PHYLLO_GET_ACCOUNTS_URL = "https://api.sandbox.insightiq.ai/v1/accounts";
const PHYLLO_GET_ACCOUNTS_URL = `${process.env.PHYLLO_API_BASE_URL}/accounts`;

const PHYLLO_CLIENT_ID = process.env.PHYLLO_CLIENT_ID;
const PHYLLO_SECRET_ID = process.env.PHYLLO_SECRET_ID;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id query parameter" });
  }

  try {
    // Node-compatible Basic Auth header
    const auth = Buffer.from(`${PHYLLO_CLIENT_ID}:${PHYLLO_SECRET_ID}`).toString("base64");

    const headers = {
      "Authorization": "Basic " + auth,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${PHYLLO_GET_ACCOUNTS_URL}?user_id=${user_id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    return res.status(500).json({ error: "Failed to fetch accounts" });
  }
}
