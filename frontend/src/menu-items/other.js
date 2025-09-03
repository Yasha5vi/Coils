// assets
import { IconBrandChrome, IconHelp, IconSettings2, IconCertificate } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp, IconSettings2, IconCertificate };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'certifications',
      title: 'Certifications',
      type: 'item',
      url: '/certifications',
      icon: icons.IconCertificate,
      breadcrumbs: false
    }
    ,
    {
      id: 'setting',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.IconSettings2,
      breadcrumbs: false
    }
  ]
};

export default other;
