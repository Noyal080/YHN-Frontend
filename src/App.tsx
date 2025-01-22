import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AdminDashboard from "./admin/Dashboard";
import SliderSection from "./admin/Home/Slider";
import { useEffect } from "react";
import LoginPage from "./auth/Login";
import SliderForm from "./admin/Home/Slider/SliderForm";
import ProjectSection from "./admin/Projects";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/slider" element={<SliderSection />} />
        <Route path="/admin/slider/add" element={<SliderForm />} />
        <Route path="/admin/slider/edit/:id" element={<SliderForm />} />
        <Route path="/admin/projects" element={<ProjectSection />} />
      </Routes>
    </Router>
  );
}

export default App;
