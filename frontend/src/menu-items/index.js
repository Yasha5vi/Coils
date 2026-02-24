import dashboard from './dashboard';
import utilities from './utilities';
import other from './other';
import { useAuth } from '../contexts/AuthContext';

const useMenuItems = () => {
  const { roles = [] } = useAuth();
  const isRecruiter = roles.some((r) => String(r).toUpperCase().includes('RECRUITER'));

  if (!isRecruiter) {
    return {
      items: [dashboard, utilities, other]
    };
  }

  // Recruiter menu: keep mostly same as member, only swap needed entries
  const recruiterDashboard = {
    ...dashboard,
    children: dashboard.children.map((item) =>
      item.id === 'default'
        ? { ...item, url: '/hr/dashboard' }
        : item
    )
  };

  const recruiterUtilities = {
  ...utilities,
  children: utilities.children.map((item) => {
    if (item.id === 'util-typography') {
      return { ...item, title: 'Post a Job', url: '/hr/jobs' };
    }
    if (item.id === 'util-color') {
      return { ...item, title: 'Matches', url: '/hr/matches' };
    }
    return item;
  })
};


  const recruiterOther = {
  ...other,
  children: other.children.filter((item) => item.id !== 'certifications')
};

return {
  items: [recruiterDashboard, recruiterUtilities, recruiterOther]
};

};

export default useMenuItems;
