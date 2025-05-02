import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { Suspense, useEffect, lazy, useCallback, memo } from "react";
import { ProtectedRoute, ReverseProtectedRoute } from "./common/ProtectedRoute";
import SkeletonLoading from "./LazyLoader";
import "./App.css";

// Lazy-loaded components for better code splitting
const LoginPage = lazy(() => import("./auth/Login"));
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
const NotFound = lazy(() => import("./common/NotFound"));

// Dynamic imports for admin routes
const SliderSection = lazy(() => import("./admin/Home/Slider"));
const SliderForm = lazy(() => import("./admin/Home/Slider/SliderForm"));
const PartnerSlider = lazy(() => import("./admin/Home/Partner Slider"));
const PartnerSliderForm = lazy(
  () => import("./admin/Home/Partner Slider/PartnerSliderForm")
);
const ChairpersonMessage = lazy(
  () => import("./admin/Home/Chairperson Message")
);
const MessageRequest = lazy(() => import("./admin/Home/Message Request"));
const UsSection = lazy(() => import("./admin/About/UsSection"));
const TeamSection = lazy(() => import("./admin/Our Teams/Teams"));
const TeamsForms = lazy(() => import("./admin/Our Teams/Teams/TeamsForms"));
const Testimonial = lazy(() => import("./admin/About/Testimonial"));
const TestimonialForm = lazy(
  () => import("./admin/About/Testimonial/TestimonialForm")
);
const Donations = lazy(() => import("./admin/About/Donation"));
const DonationView = lazy(() => import("./admin/About/Donation/DonationView"));
const ProjectSection = lazy(() => import("./admin/Our Work"));
const WorkForms = lazy(() => import("./admin/Our Work/WorkForm"));
const ViewWork = lazy(() => import("./admin/Our Work/ViewWork"));
const EventSection = lazy(() => import("./admin/Events"));
const EventForm = lazy(() => import("./admin/Events/EventForm"));
const ViewEvent = lazy(() => import("./admin/Events/ViewEvents"));
const VolunteerSection = lazy(() => import("./admin/Join Us/Volunteer"));
const VolunteerForm = lazy(
  () => import("./admin/Join Us/Volunteer/VolunteerForm")
);
const InternshipSection = lazy(() => import("./admin/Join Us/Internship"));
const InternshipForm = lazy(
  () => import("./admin/Join Us/Internship/InternshipForm")
);
const Services = lazy(() => import("./admin/Services"));
const ServiceForms = lazy(() => import("./admin/Services/ServiceForm"));
const ImageSection = lazy(() => import("./admin/Gallery/Image"));
const ImageForm = lazy(() => import("./admin/Gallery/Image/ImageForm"));
const ImageViewSection = lazy(
  () => import("./admin/Gallery/Image/ImageViewSection")
);
const VideoSection = lazy(() => import("./admin/Gallery/Video"));
const VideoForm = lazy(() => import("./admin/Gallery/Video/VideoForm"));
const ProfilePage = lazy(() => import("./admin/profile"));
const ContactUsPage = lazy(() => import("./admin/Settings/ContactUs"));
const NewsSection = lazy(() => import("./admin/News"));
const NewsForm = lazy(() => import("./admin/News/NewsForm"));
const NewsView = lazy(() => import("./admin/News/NewsView"));
const OrganizationDetails = lazy(
  () => import("./admin/Settings/Organization Details")
);
const OurImpact = lazy(() => import("./admin/Home/Our Impact"));
const OurImpactForm = lazy(
  () => import("./admin/Home/Our Impact/OurImpactForm")
);
const ViewInternship = lazy(
  () => import("./admin/Join Us/Internship/ViewInternship")
);
const ViewVolunteer = lazy(
  () => import("./admin/Join Us/Volunteer/ViewVolunteerForm")
);
const BOD = lazy(() => import("./admin/Our Teams/BOD"));
const BODForm = lazy(() => import("./admin/Our Teams/BOD/BODForm"));
const Fellow = lazy(() => import("./admin/Our Teams/Fellow"));
const FellowForm = lazy(() => import("./admin/Our Teams/Fellow/FellowForm"));
const Intern = lazy(() => import("./admin/Our Teams/Interns"));
const InternForm = lazy(() => import("./admin/Our Teams/Interns/InternForm"));
const JobApplication = lazy(() => import("./admin/Join Us"));
const JobApplicationForm = lazy(
  () => import("./admin/Join Us/JobApplicationForm")
);
const JobApplicationView = lazy(
  () => import("./admin/Join Us/ViewJobApplication")
);

const ScrollToTop = memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
});

// Route configuration objects for better organization
const adminRoutes = [
  { path: "/", element: <AdminDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },

  // Home Section
  { path: "/admin/sliders", element: <SliderSection /> },
  { path: "/admin/sliders/add", element: <SliderForm /> },
  { path: "/admin/sliders/edit/:id", element: <SliderForm /> },
  { path: "/admin/partners", element: <PartnerSlider /> },
  { path: "/admin/partners/add", element: <PartnerSliderForm /> },
  { path: "/admin/partners/edit/:id", element: <PartnerSliderForm /> },
  { path: "/admin/messages", element: <MessageRequest /> },
  { path: "/admin/chairperson-message", element: <ChairpersonMessage /> },
  { path: "/admin/our-impact", element: <OurImpact /> },
  { path: "/admin/our-impact/add", element: <OurImpactForm /> },
  { path: "/admin/our-impact/edit/:id", element: <OurImpactForm /> },

  // About Us Section
  { path: "/admin/about", element: <UsSection /> },

  { path: "/admin/testimonials", element: <Testimonial /> },
  { path: "/admin/testimonials/add", element: <TestimonialForm /> },
  { path: "/admin/testimonials/edit/:id", element: <TestimonialForm /> },
  { path: "/admin/donation", element: <Donations /> },
  { path: "/admin/donation/:id", element: <DonationView /> },

  //Our Team Section
  { path: "/admin/teams", element: <TeamSection /> },
  { path: "/admin/teams/add", element: <TeamsForms /> },
  { path: "/admin/teams/edit/:id", element: <TeamsForms /> },
  { path: "/admin/bod", element: <BOD /> },
  { path: "/admin/bod/add", element: <BODForm /> },
  { path: "/admin/bod/edit/:id", element: <BODForm /> },
  { path: "/admin/fellows", element: <Fellow /> },
  { path: "/admin/fellow/add", element: <FellowForm /> },
  { path: "/admin/fellow/edit/:id", element: <FellowForm /> },
  { path: "/admin/interns", element: <Intern /> },
  { path: "/admin/intern/add", element: <InternForm /> },
  { path: "/admin/intern/edit/:id", element: <InternForm /> },

  // Projects Section
  { path: "/admin/our-works", element: <ProjectSection /> },
  { path: "/admin/our-works/add", element: <WorkForms /> },
  { path: "/admin/our-works/edit/:id", element: <WorkForms /> },
  { path: "/admin/our-works/view/:id", element: <ViewWork /> },

  // Events Section
  { path: "/admin/events", element: <EventSection /> },
  { path: "/admin/events/add", element: <EventForm /> },
  { path: "/admin/events/edit/:id", element: <EventForm /> },
  { path: "/admin/events/view/:id", element: <ViewEvent /> },

  // Join Us Section
  { path: "/admin/join-us", element: <JobApplication /> },
  { path: "/admin/join-us/add", element: <JobApplicationForm /> },
  { path: "/admin/join-us/edit/:id", element: <JobApplicationForm /> },
  { path: "/admin/join-us/view/:id", element: <JobApplicationView /> },

  { path: "/admin/volunteer", element: <VolunteerSection /> },
  { path: "/admin/volunteer/add", element: <VolunteerForm /> },
  { path: "/admin/volunteer/edit/:id", element: <VolunteerForm /> },
  { path: "/admin/internship", element: <InternshipSection /> },
  { path: "/admin/internship/add", element: <InternshipForm /> },
  { path: "/admin/internship/edit/:id", element: <InternshipForm /> },
  { path: "/admin/internship/view/:id", element: <ViewInternship /> },
  { path: "/admin/volunteer/view/:id", element: <ViewVolunteer /> },

  // Services Section
  { path: "/admin/sectors", element: <Services /> },
  { path: "/admin/sectors/add", element: <ServiceForms /> },
  { path: "/admin/sectors/edit/:id", element: <ServiceForms /> },

  // Gallery Section
  { path: "/admin/gallery/images", element: <ImageSection /> },
  { path: "/admin/gallery/images/add", element: <ImageForm /> },
  { path: "/admin/gallery/images/view/:id", element: <ImageViewSection /> },
  { path: "/admin/gallery/videos", element: <VideoSection /> },
  { path: "/admin/gallery/videos/edit/:id", element: <VideoForm /> },
  { path: "/admin/gallery/videos/add", element: <VideoForm /> },

  // Profile Section
  { path: "/admin/profile", element: <ProfilePage /> },
  { path: "/admin/contact-us", element: <ContactUsPage /> },

  // News Section
  { path: "/admin/news", element: <NewsSection /> },
  { path: "/admin/news/add", element: <NewsForm /> },
  { path: "/admin/news/edit/:id", element: <NewsForm /> },
  { path: "/admin/news/view/:id", element: <NewsView /> },

  // Organization Details Section
  { path: "/admin/organization-details", element: <OrganizationDetails /> },
];

function App() {
  const renderRoute = useCallback(
    (route: (typeof adminRoutes)[0]) => (
      <Route
        key={route.path}
        path={route.path}
        element={<ProtectedRoute>{route.element}</ProtectedRoute>}
      />
    ),
    []
  );

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<SkeletonLoading />}>
        <Routes>
          <Route
            path="/login"
            element={
              <ReverseProtectedRoute>
                <LoginPage />
              </ReverseProtectedRoute>
            }
          />
          {adminRoutes.map(renderRoute)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
