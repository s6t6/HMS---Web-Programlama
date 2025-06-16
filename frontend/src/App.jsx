import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DoktorLogin from "./pages/DoktorLogin";
import DoktorRandevu from "./pages/DoktorRandevu.jsx";
import Unauthorized401 from "./pages/Unauthorized401";
import NotFound404 from "./pages/NotFound404";
import HastaKayit from "./pages/HastaKayit";
import HastaKayitLogin from "./pages/HastaKayitLogin";
import YeniHasta from "./pages/YeniHasta";
import RandevuOnay from "./pages/RandevuOnay.jsx";
import Kurulum from "./pages/Kurulum.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kurulum />}></Route>
        <Route path="/doktor/login" element={<DoktorLogin />} />
        <Route path="/randevular" element={<DoktorRandevu />} />
        <Route path="/randevu/onay" element={<RandevuOnay />} />
        <Route path="/hastakayit" element = {<HastaKayit />} />
        <Route path="/hastakayit/login" element = { <HastaKayitLogin/>}></Route>
        <Route path="/hastalar/yeni" element={<YeniHasta />} />
        <Route path="/404" element={<NotFound404 />} />
        <Route path="/401" element={<Unauthorized401 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
