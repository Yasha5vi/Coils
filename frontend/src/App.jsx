import { RouterProvider } from 'react-router-dom';
import router from './routes';
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <NotificationProvider>
          <UserProfileProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </UserProfileProvider>
        </NotificationProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}

export default App;
