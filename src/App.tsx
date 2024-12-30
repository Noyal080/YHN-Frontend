import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AdminDashboard from "./admin/Dashboard";
import "ckeditor5/ckeditor5.css";
import SliderSection from "./admin/Home/Slider";
import AddForm from "./admin/Home/form";
import { useEffect } from "react";

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
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/slider" element={<SliderSection />} />
        <Route path="/form" element={<AddForm />} />
      </Routes>
    </Router>
  );
}

export default App;
