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
// import BodSection from "./admin/About/BodSection";
import TeamSection from "./admin/About/Teams";
import Testimonial from "./admin/About/Testimonial";
import TestimonialForm from "./admin/About/Testimonial/TestimonialForm";
import Donations from "./admin/About/Donation";
// import Services from "./admin/Services";
// import ServiceForms from "./admin/Services/ServiceForm";
import EventSection from "./admin/Events";
import CareerSection from "./admin/About/Career";
import ImageSection from "./admin/Gallery/Image";
import VideoSection from "./admin/Gallery/Video";
import TeamsForms from "./admin/About/Teams/TeamsForms";
import MessageRequest from "./admin/Home/Message Request";
import MessageView from "./admin/Home/Message Request/MessageView";
import ImageForm from "./admin/Gallery/Image/ImageForm";
import InternshipSection from "./admin/Join Us/Internship";
import VolunteerSection from "./admin/Join Us/Volunteer";
import InternshipForm from "./admin/Join Us/Internship/InternshipForm";
import VolunteerForm from "./admin/Join Us/Volunteer/VolunteerForm";
import WorkForms from "./admin/Projects/WorkForm";
import EventForm from "./admin/Events/EventForm";
import ImageViewSection from "./admin/Gallery/Image/ImageViewSection";
import { ProtectedRoute, ReverseProtectedRoute } from "./common/ProtectedRoute";

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
        <Route
          path="/login"
          element={
            <ReverseProtectedRoute>
              <LoginPage />
            </ReverseProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Home Section */}
        <Route
          path="/admin/sliders"
          element={
            <ProtectedRoute>
              <SliderSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sliders/add"
          element={
            <ProtectedRoute>
              <SliderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sliders/edit/:id"
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
              <MessageRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages/view/:id"
          element={
            <ProtectedRoute>
              <MessageView />
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
        {/* <Route
          path="/admin/founder"
          element={
            <ProtectedRoute>
              <BodSection />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute>
              <TeamSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams/add"
          element={
            <ProtectedRoute>
              <TeamsForms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teams/edit/:id"
          element={
            <ProtectedRoute>
              <TeamsForms />
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
              <CareerSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/our-works"
          element={
            <ProtectedRoute>
              <ProjectSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/our-works/add"
          element={
            <ProtectedRoute>
              <WorkForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/our-works/edit/:id"
          element={
            <ProtectedRoute>
              <WorkForms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/add"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/edit/:id"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/volunteer/add"
          element={
            <ProtectedRoute>
              <VolunteerForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/volunteer/edit/:id"
          element={
            <ProtectedRoute>
              <VolunteerForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/internship"
          element={
            <ProtectedRoute>
              <InternshipSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/internship/add"
          element={
            <ProtectedRoute>
              <InternshipForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/internship/edit/:id"
          element={
            <ProtectedRoute>
              <InternshipForm />
            </ProtectedRoute>
          }
        />

        {/* <Route
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
              <ServiceForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services/edit/:id"
          element={
            <ProtectedRoute>
              <ServiceForms />
            </ProtectedRoute>
          }
        /> */}

        {/* Image Section  */}
        <Route
          path="/admin/gallery/images"
          element={
            <ProtectedRoute>
              <ImageSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery/images/add"
          element={
            <ProtectedRoute>
              <ImageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery/images/view/:id"
          element={
            <ProtectedRoute>
              <ImageViewSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery/videos"
          element={
            <ProtectedRoute>
              <VideoSection />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
