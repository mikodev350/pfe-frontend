import Layout from "../../components/layout/Layout";

// import AddExam from "../Exam/AddExam";
// import SideBarcheck from "../../component/SideBar/SideBarcheck";
import { Routes, Route } from "react-router-dom";
// import ChangePassword from "./ChangePassword";
// import OfferSettings from "./OfferSettings";
import React from "react";
import AccountInformation from "../account-information/AccountInformation";
import ChangePassword from "../change-password/ChangePassword";


export default function Settings() {
  const role = React.useMemo(() => {
    return localStorage.getItem("role");
  }, []);
  return (
    <>
      <Layout>
        <Routes>
  
           <Route
            path="information-account"
            element={<AccountInformation />}
          ></Route>
            <Route
            path="change-password"
            element={<ChangePassword />}
          ></Route>
          {/* <Route path="change-password" element={<ChangePassword />}></Route>
          {role === "TEACHER" ? (
            <Route path="offers" element={<OfferSettings />}></Route>
          ) : null} */}
        </Routes>
      </Layout>
    </>
  );
}
