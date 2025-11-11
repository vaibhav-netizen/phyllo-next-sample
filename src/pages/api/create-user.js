// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const PHYLLO_CREATE_USER_URL = "https://api.sandbox.getphyllo.com/v1/users";
const PHYLLO_CLIENT_ID = process.env.PHYLLO_CLIENT_ID;
const PHYLLO_SECRET_ID = process.env.PHYLLO_SECRET_ID;

export default async function handler(req, res) {
  try {
    const auth = Buffer.from(`${PHYLLO_CLIENT_ID}:${PHYLLO_SECRET_ID}`).toString("base64");
    const headers = {
      "Authorization": "Basic " + auth,
      "Content-Type": "application/json",
    };

    if (req.method === "POST") {
      // Create a new Phyllo user
      const response = await fetch(PHYLLO_CREATE_USER_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!data.id) {
        console.error("Phyllo create-user failed:", data);
        return res.status(500).json({ error: "User creation failed", details: data });
      }

      // Return only the user ID
      return res.status(response.status).json({ id: data.id });
    }

    if (req.method === "GET") {
      // Optional: list all users
      const response = await fetch(PHYLLO_CREATE_USER_URL, {
        method: "GET",
        headers,
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in create-user API:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
