import React from "react";
import { useEffect, useState } from "react";
import PhylloSDK from "../phylloSDKService/phylloSDKInit";
import { getAccounts } from "../phylloSDKService/phylloServiceAPIs";
import Navbar from "@/components/Navbar/Navbar";

const Users = () => {
  let [accounts, setAccounts] = useState([]);
  let [attributes, setAttributes] = useState({});
  let phylloSDK = new PhylloSDK();

  const handleAddAccount = async () => {
    await phylloSDK.openPhylloSDK();
  };

  const flattenObj = (ob) => {
    let result = {};
    for (const i in ob) {
      if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
        const temp = flattenObj(ob[i]);
        for (const j in temp) {
          result[i + "." + j] = temp[j];
        }
      } else {
        result[i] = ob[i];
      }
    }
    return result;
  };

  useEffect(() => {
    const userId = localStorage.getItem("PHYLLO_USER_ID");
    if (userId) {
      (async () => {
        let response = await getAccounts(userId);
        if (response && response.length > 0) {
          let updatedArray = response.map((obj) => flattenObj(obj));
          setAccounts(updatedArray);
          setAttributes(updatedArray[0]);
        }
      })();
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="table-responsive" style={{ display: "block", margin: "auto", width: "95%" }}>
        <table className="table table-striped table-bordered" style={{ margin: "20px" }}>
          <thead>
            <tr>
              <th>Attribute</th>
              {accounts.map((_, idx) => (
                <th scope="col" key={idx}>
                  Account-{idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(attributes).map(([key], idx) => (
              <tr key={idx}>
                <td>{key}</td>
                {accounts.map((account, cIdx) => (
                  <Account key={cIdx} accountObj={account} attrKey={key} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="account-connect-button" onClick={handleAddAccount}>
        Add Another Account
      </button>
    </div>
  );
};

function Account({ accountObj, attrKey }) {
  const value = accountObj[attrKey];

  if (attrKey === "profile_pic_url" || attrKey === "work_platform.logo_url") {
    return (
      <td>
        {value ? <img src={value} alt="" style={{ maxWidth: "50px", borderRadius: "4px" }} /> : "-"}
      </td>
    );
  } else if (attrKey === "status") {
    return (
      <td>
        <div className="status" style={{ display: "flex", alignItems: "center" }}>
          {value || "-"}
          <div
            style={{
              width: "10px",
              height: "10px",
              background: value === "CONNECTED" ? "green" : value === "NOT_CONNECTED" ? "red" : "orange",
              borderRadius: "50%",
              marginLeft: "10px",
            }}
          ></div>
        </div>
      </td>
    );
  } else {
    return <td>{value !== undefined ? value : "-"}</td>;
  }
}

export default Users;
