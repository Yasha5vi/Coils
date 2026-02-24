import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router';
import { useAuth } from 'contexts/AuthContext';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const About = Loadable(lazy(() => import('views/about')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const Certifications = Loadable(lazy(() => import('views/certifications')));
const Settings = Loadable(lazy(() => import('views/settings')));
const SocialProfile = Loadable(lazy(() => import('views/social-profile')));
const Projects = Loadable(lazy(() => import('views/projects')));
const Timeline = Loadable(lazy(() => import('views/timeline')));
const HrDashboard = Loadable(lazy(() => import('views/hr/Dashboard')));
const HrJobs = Loadable(lazy(() => import('views/hr/Dashboard/jobs')));
const HrMatches = Loadable(lazy(() => import('views/hr/Dashboard/matches')));






const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
  index: true,
  element: <RoleHomeRedirect />
}
,
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: 'projects',
      element: <Projects />
    },
    {
      path: 'certifications',
      element: <Certifications />
    },
    {
      path: 'timeline',
      element: <Timeline />
    },
    {
      path: 'about',
      element: <About />
    },
    {
      path: 'settings',
      element: <Settings />
    },
    {
      path: 'socialProfile',
      element: <SocialProfile />
    },
    {
      path: 'hr/dashboard',
      element: <HrDashboard />
    },
    {
      path: 'hr/jobs',
      element: <HrJobs />
    },
    {
      path: 'hr/matches',
      element: <HrMatches />
    }




  ]
};
function RoleHomeRedirect() {
  const { roles } = useAuth();
  const isRecruiter = (roles || []).some((r) => String(r).toUpperCase().includes('RECRUITER'));
  return <Navigate to={isRecruiter ? '/hr/dashboard' : '/dashboard/default'} replace />;
}
export default MainRoutes;
