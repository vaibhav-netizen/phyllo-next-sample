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
        environment: process.env.NEXT_PUBLIC_PHYLLO_ENVIRONMENT,
        userId,
        token,
        workPlatformId: null,
      };

      const phylloConnect = window.PhylloConnect.initialize(config);

      phylloConnect.on(
        "accountConnected",
        (accountId, workplatformId, userId) => {
          console.log(
            `onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`
          );

          // Create a custom modal to display the information
          const modal = document.createElement("div");
          modal.style.position = "fixed";
          modal.style.top = "50%";
          modal.style.left = "50%";
          modal.style.transform = "translate(-50%, -50%)";
          modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
          modal.style.color = "#fff";
          modal.style.padding = "20px";
          modal.style.borderRadius = "10px";
          modal.style.zIndex = "9999";
          modal.style.maxWidth = "400px";
          modal.style.wordWrap = "break-word";

          const message = `
    Account Connected!
    \nAccount ID: ${accountId}
    \nWork Platform ID: ${workplatformId}
    \nUser ID: ${userId}
  `;

          modal.textContent = message;

          // Create a "Close" button
          const closeButton = document.createElement("button");
          closeButton.textContent = "Close";
          closeButton.style.marginTop = "10px";
          closeButton.style.padding = "5px 10px";
          closeButton.style.cursor = "pointer";

          closeButton.onclick = () => {
            document.body.removeChild(modal); // Close the modal
          };

          modal.appendChild(closeButton);
          document.body.appendChild(modal);

          // Allow the user to select and copy the text
          modal.style.userSelect = "text";
        }
      );

      phylloConnect.on(
        "accountDisconnected",
        (accountId, workplatformId, userId) => {
          console.log(
            `onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`
          );
        }
      );

      phylloConnect.on("tokenExpired", (userId) => {
        console.log(`onTokenExpired: ${userId}`);
        if (
          window.confirm("Your session has expired, but we can help you fix it")
        ) {
          localStorage.removeItem("PHYLLO_SDK_TOKEN");
          this.openPhylloSDK();
        } else {
          window.location.href = "/";
        }
      });

      phylloConnect.on("exit", (reason, userId) => {
        console.log(`onExit: ${reason}, ${userId}`);
        // alert("Phyllo SDK exit reason: " + reason);
        // window.location.href = "/accounts";
      });

      phylloConnect.on(
        "connectionFailure",
        (reason, workplatformId, userId) => {
          console.log(
            `onConnectionFailure: ${reason}, ${workplatformId}, ${userId}`
          );
          alert("WorkPlatform connection failure reason: " + reason);
        }
      );

      phylloConnect.open();
    } catch (err) {
      console.error("Error initializing Phyllo SDK:", err);
      alert("Failed to initialize Phyllo SDK. Check console for details.");
    }
  }
}

export default PhylloSDK;
