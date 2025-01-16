import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AdminDashboard from "./admin/Dashboard";
import SliderSection from "./admin/Home/Slider";
import AddForm from "./admin/Home/form";
import { useEffect } from "react";
import LoginPage from "./auth/Login";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/slider" element={<SliderSection />} />
        <Route path="/form" element={<AddForm />} />
      </Routes>
    </Router>
  );
}

export default App;
