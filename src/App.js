import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"; // Correctly import BrowserRouter and Routes
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/SignUp";
import "./components/table/Tables.css";
import Quiz from "./pages/quiz/quiz/Quiz";
import Profile from "./pages/Profile/Profile";
import ChatApp from "./pages/chat/chatApp";
import Conversation from "./pages/chat/Conversation";
import Settings from "./pages/settings/settings";
import Socket from "./components/Socket/Socket";
import Quizzes from "./pages/quiz/quiz/Quizzes";
// import PrivateRoute from "./path/to/PrivateRoute"; // Assuming PrivateRoute is a custom component, provide the correct path
// import DashboardStudent from "./path/to/DashboardStudent"; // Provide the correct path to DashboardStudent

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom-bootstrap.css";

import Notification from "./components/Notifications";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
// import Dashboard from "./pages/dashboard/dashboard";
function PrivateRoute({ element: Component }) {
  const token = window.localStorage.getItem("token");
  return token ? <Component /> : <Navigate to="/login" replace />;
}
function OnlyVisitorRoute({ element: Component }) {
  const token = window.localStorage.getItem("token");
  return !token ? <Component /> : <Navigate to="/dashboard/home" replace />;
}
function App() {
  // useSyncOnConnectionRestore();

  return (
    <>
      <Router>
        <Socket />
        <Notification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<OnlyVisitorRoute element={Login} />} />
          <Route
            path="/signup"
            element={<OnlyVisitorRoute element={SignUp} />}
          />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route
            path="/profile/:id"
            element={<PrivateRoute element={Profile} />}
          />
          <Route
            path="/dashboard/*"
            element={<PrivateRoute element={Dashboard} />}
          />

          <Route path="/chat" element={<PrivateRoute element={ChatApp} />} />
          <Route
            path="/chat/:id"
            element={<PrivateRoute element={Conversation} />}
          />
          <Route
            path="/settings/*"
            element={<PrivateRoute element={Settings} />}
          />
          <Route path="/quiz" element={<PrivateRoute element={Quiz} />} />
          <Route path="/quizzes" element={<PrivateRoute element={Quizzes} />} />
          <Route
            path="/settings"
            element={<PrivateRoute element={Settings} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
