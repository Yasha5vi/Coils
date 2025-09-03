// assets
import { IconTypography , IconPalette, IconShadow, IconWindmill, IconTimeline } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconTimeline
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'My projects',
      type: 'item',
      url: '/projects',
      icon: icons.IconShadow,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Timeline',
      type: 'item',
      url: '/timeline',
      icon: icons.IconTimeline,
      breadcrumbs: false
    },
    {
      id: 'util-shadow',
      title: 'About',
      type: 'item',
      url: '/about',
      icon: icons.IconTypography,
      breadcrumbs: false
    }
  ]
};

export default utilities;
