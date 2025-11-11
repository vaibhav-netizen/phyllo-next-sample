const getHeaders = () => ({
  "Content-Type": "application/json",
});

const createUser = async (username, externalId) => {
  let userId = localStorage.getItem("PHYLLO_USER_ID");
  if (userId) return userId;

  try {
    const response = await fetch("/api/create-user", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: username,
        external_id: externalId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Create user failed:", error);
      return null;
    }

    const data = await response.json();

    if (!data.id) {
      console.error("Create user response missing ID:", data);
      return null;
    }

    localStorage.setItem("PHYLLO_USER_ID", data.id);
    return data.id;
  } catch (err) {
    console.error("Error in createUser:", err);
    return null;
  }
};

const createUserToken = async (userId) => {
  if (!userId) throw new Error("Cannot create token: userId is undefined");

  let token = localStorage.getItem("PHYLLO_SDK_TOKEN");
  if (token) return token;

  try {
    const response = await fetch("/api/create-token", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        user_id: userId,
        products: ["IDENTITY", "ENGAGEMENT"],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Create token failed:", error);
      return null;
    }

    const data = await response.json();

    if (!data.sdk_token) {
      console.error("Create token response missing sdk_token:", data);
      return null;
    }

    localStorage.setItem("PHYLLO_SDK_TOKEN", data.sdk_token);
    return data.sdk_token;
  } catch (err) {
    console.error("Error in createUserToken:", err);
    return null;
  }
};

const getAccounts = async (userId) => {
  if (!userId) throw new Error("Cannot fetch accounts: userId is undefined");

  try {
    const response = await fetch(`/api/get-accounts?user_id=${userId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Get accounts failed:", error);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Error in getAccounts:", err);
    return [];
  }
};

export { createUser, createUserToken, getAccounts };
