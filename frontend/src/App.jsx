import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DoktorLogin from "./pages/DoktorLogin";
import RandevuPage from "./pages/DoktorRandevuList";
import Unauthorized401 from "./pages/Unauthorized401";
import NotFound404 from "./pages/NotFound404";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoktorLogin />} />
        <Route path="/randevular" element={<RandevuPage />} />
        <Route path="/404" element={<NotFound404 />} />
        <Route path="/401" element={<Unauthorized401 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
