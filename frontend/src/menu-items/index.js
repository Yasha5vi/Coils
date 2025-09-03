import dashboard from './dashboard';
import utilities from './utilities';
import other from './other';
import { useAuth } from '../contexts/AuthContext';

const useMenuItems = () => {
  const { user } = useAuth();

  const menuItems = {
    items: [dashboard, utilities, other]
  };

  // if (user?.roles?.length === 2) {
  //   menuItems.items.push(other);
  // }

  return menuItems;
};

export default useMenuItems;
