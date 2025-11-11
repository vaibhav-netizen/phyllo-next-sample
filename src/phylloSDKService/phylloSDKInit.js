import { createUser, createUserToken } from "./phylloServiceAPIs";

class PhylloSDK {
  async openPhylloSDK() {
    try {
      const timeStamp = new Date();
      // const userId = await createUser("Test App", timeStamp.getTime());
      // let userId = await createUser("Test App", String(timeStamp.getTime()));
      let userId = await createUser("Test App", timeStamp.getTime().toString());



      if (!userId) {
        console.error("Cannot create SDK: user creation failed");
        alert("Failed to create user. Please try again.");
        return;
      }

      const token = await createUserToken(userId);

      if (!token) {
        console.error("Cannot create SDK: token creation failed");
        alert("Failed to create SDK token. Please try again.");
        return;
      }

      const config = {
        clientDisplayName: "Test App",
        environment: "sandbox",
        userId,
        token,
        workPlatformId: null,
      };

      const phylloConnect = window.PhylloConnect.initialize(config);

      phylloConnect.on("accountConnected", (accountId, workplatformId, userId) => {
        console.log(`onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`);
      });

      phylloConnect.on("accountDisconnected", (accountId, workplatformId, userId) => {
        console.log(`onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`);
      });

      phylloConnect.on("tokenExpired", (userId) => {
        console.log(`onTokenExpired: ${userId}`);
        if (window.confirm("Your session has expired, but we can help you fix it")) {
          localStorage.removeItem("PHYLLO_SDK_TOKEN");
          this.openPhylloSDK();
        } else {
          window.location.href = "/";
        }
      });

      phylloConnect.on("exit", (reason, userId) => {
        console.log(`onExit: ${reason}, ${userId}`);
        alert("Phyllo SDK exit reason: " + reason);
        window.location.href = "/accounts";
      });

      phylloConnect.on("connectionFailure", (reason, workplatformId, userId) => {
        console.log(`onConnectionFailure: ${reason}, ${workplatformId}, ${userId}`);
        alert("WorkPlatform connection failure reason: " + reason);
      });

      phylloConnect.open();
    } catch (err) {
      console.error("Error initializing Phyllo SDK:", err);
      alert("Failed to initialize Phyllo SDK. Check console for details.");
    }
  }
}

export default PhylloSDK;
