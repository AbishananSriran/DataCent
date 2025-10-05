import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reports/:id" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;