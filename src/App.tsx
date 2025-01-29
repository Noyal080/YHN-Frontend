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
import PartnerSlider from "./admin/Home/Partner Slider";
import PartnerSliderForm from "./admin/Home/Partner Slider/PartnerSliderForm";
import UsSection from "./admin/About/UsSection";
import BodSection from "./admin/About/BodSection";
import TeamSection from "./admin/About/TeamSection";
import Testimonial from "./admin/About/Testimonial";
import TestimonialForm from "./admin/About/Testimonial/TestimonialForm";
import ProtectedRoute from "./common/ProtectedRoute";
import Donations from "./admin/About/Donation";
import Services from "./admin/Services";

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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Home Section */}
        <Route
          path="/admin/slider"
          element={
            <ProtectedRoute>
              <SliderSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slider/add"
          element={
            <ProtectedRoute>
              <SliderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slider/edit/:id"
          element={
            <ProtectedRoute>
              <SliderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute>
              <PartnerSlider />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners/add"
          element={
            <ProtectedRoute>
              <PartnerSliderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners/edit/:id"
          element={<PartnerSliderForm />}
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <UsSection />
            </ProtectedRoute>
          }
        />
        {/* About us Section */}
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <UsSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/founder"
          element={
            <ProtectedRoute>
              <BodSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute>
              <TeamSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <Testimonial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonials/add"
          element={
            <ProtectedRoute>
              <TestimonialForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials/edit/:id"
          element={
            <ProtectedRoute>
              <TestimonialForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/donation"
          element={
            <ProtectedRoute>
              <Donations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/careers"
          element={
            <ProtectedRoute>
              <Testimonial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ProjectSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <ProjectSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services/add"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services/edit/:id"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        {/* Image Section  */}
        <Route
          path="/admin/gallery/photos"
          element={
            <ProtectedRoute>
              <ProjectSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery/videos"
          element={
            <ProtectedRoute>
              <ProjectSection />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
