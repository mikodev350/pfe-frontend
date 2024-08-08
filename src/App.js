import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Correctly import BrowserRouter and Routes
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/SignUp";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import "./components/table/Tables.css";
import Profile from "./pages/Profile/Profile";
import ChatApp from "./pages/chat/chatApp";
import Settings from "./pages/settings/settings";
import Socket from "./components/Socket/Socket";
// import PrivateRoute from "./path/to/PrivateRoute"; // Assuming PrivateRoute is a custom component, provide the correct path
// import DashboardStudent from "./path/to/DashboardStudent"; // Provide the correct path to DashboardStudent

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom-bootstrap.css";

import Notification from "./components/Notifications";

// import ResourceAccessPage from "./components/ResourceAccessPageResource/resource-access-page";
// import ResourcePreviewPage from "./pages/resourcePreviewPage/ResourcePreviewPage";
// import ResourcePreviewPageWithToken from "./pages/resourceDetail/ResourcePreviewPageWithToken";
// import ResourcePreviewPageWithId from "./pages/resourceDetail/ResourcePreviewPageWithId";

function App() {
  return (
    <>
      <Router>
        <Socket />
        <Notification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />\
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/chat" element={<ChatApp />} />
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

// // App.js
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./pages/home/Home";
// import CustomNavbar from "./pages/home/other-header";
// import Login from "./pages/login/Login";

// <CustomNavbar />

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         {/* Ajoutez d'autres routes ici */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
