import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RouteGuard from './components/RouteGuard';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgrammesPage from './pages/ProgrammesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentPortal from './dashboards/StudentPortal';
import TutorPortal from './dashboards/TutorPortal';
import AdminPortal from './dashboards/AdminPortal';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    {children}
    <Footer />
  </div>
);

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id && localStorage.getItem('giit-token')) {
      dispatch(fetchMe());
    }
  }, [dispatch, user?._id]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/programmes"
          element={
            <PublicLayout>
              <ProgrammesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        <Route
          path="/portal/student"
          element={
            <RouteGuard roles={['student']}>
              <Navigate to="/portal/student/overview" replace />
            </RouteGuard>
          }
        />
        <Route
          path="/portal/student/:section"
          element={
            <RouteGuard roles={['student']}>
              <StudentPortal />
            </RouteGuard>
          }
        />

        <Route
          path="/portal/tutor"
          element={
            <RouteGuard roles={['tutor']}>
              <Navigate to="/portal/tutor/overview" replace />
            </RouteGuard>
          }
        />
        <Route
          path="/portal/tutor/:section"
          element={
            <RouteGuard roles={['tutor']}>
              <TutorPortal />
            </RouteGuard>
          }
        />

        <Route
          path="/portal/admin"
          element={
            <RouteGuard roles={['admin']}>
              <Navigate to="/portal/admin/overview" replace />
            </RouteGuard>
          }
        />
        <Route
          path="/portal/admin/:section"
          element={
            <RouteGuard roles={['admin']}>
              <AdminPortal />
            </RouteGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
