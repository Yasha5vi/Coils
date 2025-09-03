import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserProfile } from './UserProfileContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { setCoilsHandle, setProfile  } = useUserProfile();
  const [roles,setRoles] = useState([]);
 
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (!isExpired) {
          const profile = localStorage.getItem("profile");
          if(profile){
            setProfile(JSON.parse(profile));
          }
          setUser(payload.sub); 
          setRoles(payload.roles);
          setIsAuthenticated(true);
        } else { 
          logout(); 
        }
      } catch (err) {
        console.error('Invalid token format');
        logout(); // Invalid token
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  const login = (newToken,fetchedProfile) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('profile', JSON.stringify(fetchedProfile));
    setToken(newToken); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        user,
        roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
