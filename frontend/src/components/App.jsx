import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";

const App = () => {
  return (
    <div>
        <nav></nav>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
