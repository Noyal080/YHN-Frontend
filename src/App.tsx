import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./admin/Dashboard";

import SliderSection from "./admin/Home/Slider";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/slider" element={<SliderSection />} />
      </Routes>
    </Router>
  );
}

export default App;
