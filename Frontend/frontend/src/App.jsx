import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

      

        {/* 404 */}
        <Route path="*" element={<div className="p-6">Page introuvable</div>} />
      </Routes>
    </BrowserRouter>
  );
}