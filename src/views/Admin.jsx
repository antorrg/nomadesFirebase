import React, { useState } from "react";
import { Outlet } from "react-router-dom";
//import "./styles/admin.css";
import * as Main from "../components/adminComponents/AdminIndex";
;

const Admin = () => {

  const [help, setHelp] = useState(false);
  //console.log('user: ', user)

  return (
    <>
      <div>
        <Main.AdminNav setHelp={setHelp} />
        <Outlet/>
      </div>
    </>
  );
};

export default Admin;
