import "./custom-bootstrap.css";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Correctly import BrowserRouter and Routes
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/SignUp";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import "./components/table/Tables.css";
import Profile from "./pages/Profile/Profile";
import ChatApp from "./pages/chat/chatApp";
// import PrivateRoute from "./path/to/PrivateRoute"; // Assuming PrivateRoute is a custom component, provide the correct path
// import DashboardStudent from "./path/to/DashboardStudent"; // Provide the correct path to DashboardStudent

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
<<<<<<< HEAD
          <Route path="/signup" element={<SignUp />} />
=======
          <Route path="/login/:token" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />\
>>>>>>> origin/filter
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
