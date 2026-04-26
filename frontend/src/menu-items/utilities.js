// assets
import { IconTypography , IconPalette, IconShadow, IconWindmill, IconTimeline, IconSparkles } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconTimeline,
  IconSparkles
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
    id: 'enhance',
    title: 'Enhance Resume',
    type: 'item',
    url: '/enhance',
    icon: icons.IconSparkles
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
