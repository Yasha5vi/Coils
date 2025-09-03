import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const About = Loadable(lazy(() => import('views/about')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const Certifications = Loadable(lazy(() => import('views/certifications')));
const Settings = Loadable(lazy(() => import('views/settings')));
const SocialProfile = Loadable(lazy(() => import('views/social-profile')));
const Projects = Loadable(lazy(() => import('views/projects')));
const Timeline = Loadable(lazy(() => import('views/timeline')));

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
      element: <Navigate to="dashboard/default" replace />
    },
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
    }
  ]
};

export default MainRoutes;
