import { IconDashboard, IconBriefcase, IconListCheck } from '@tabler/icons-react';

const icons = { IconDashboard, IconBriefcase, IconListCheck };

const hr = {
  id: 'hr',
  title: 'HR',
  type: 'group',
  children: [
    {
      id: 'hr-dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/hr/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'hr-jobs',
      title: 'Jobs',
      type: 'item',
      url: '/hr/jobs',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },
    {
      id: 'hr-matches',
      title: 'Matches',
      type: 'item',
      url: '/hr/matches',
      icon: icons.IconListCheck,
      breadcrumbs: false
    }
  ]
};

export default hr;
