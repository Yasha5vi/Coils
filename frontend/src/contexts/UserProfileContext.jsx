// UserProfileContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    codeforcesHandle: '',
    leetcodeHandle: '',
    codechefHandle: '', 
    geeksforgeeksHandle: '',
    coilsHandle: '',
    bio: '',
    about: '',
    projects: [],            // Array of project objects { name, description, link }
    platformDataJson: {},      // e.g., { codeforces: {...}, leetcode: {...}, ... }
    education: '',           // Array of education objects { degree, college, year }
    experience: '',          // Array of work objects { company, role, duration, description }
    skills: '',              // Array of strings or objects { name, level }
    achievements: [],
    journey: [],          // Array of strings or objects { title, description, date }
    email: '',
    phone: '',
    linkedin: '',
    github: '',
  });

  const [loading, setLoading] = useState(true);

  // Helper functions to update parts of profile individually
  const setCodeforcesHandle = (codeforcesHandle) => setProfile(prev => ({ ...prev, codeforcesHandle }));
  const setLeetcodeHandle = (leetcodeHandle) => setProfile(prev => ({ ...prev, leetcodeHandle }));
  const setCodechefHandle = (codechefHandle) => setProfile(prev => ({ ...prev, codechefHandle }));
  const setGeeksforgeeksHandle = (geeksforgeeksHandle) => setProfile(prev => ({ ...prev, geeksforgeeksHandle }));
  const setCoilsHandle = (coilsHandle) => setProfile(prev => ({ ...prev, coilsHandle }));

  const setFirstName = (firstName) => setProfile(prev => ({ ...prev, firstName }));
  const setLastName = (lastName) => setProfile(prev => ({ ...prev, lastName }));
  const setBio = (bio) => setProfile(prev => ({ ...prev, bio }));
  const setAbout = (about) => setProfile(prev => ({ ...prev, about }));
  const setProjects = (projects) => setProfile(prev => ({ ...prev, projects }));
  const setPlatformData = (platform, data) => {
    setProfile(prev => ({
      ...prev,
      platformDataJson: {
        ...(prev?.platformDataJson ?? {}), // fallback to {}
        [platform]: {
          ...(prev?.platformDataJson?.[platform] ?? {}), // fallback to {}
          ...data,
        },
      },
    }));
  };

  const setEducation = (education) => setProfile(prev => ({ ...prev, education }));
  const setExperience = (experience) => setProfile(prev => ({ ...prev, experience }));
  const setSkills = (skills) => setProfile(prev => ({ ...prev, skills }));
  const setAchievements = (achievements) => setProfile(prev => ({ ...prev, achievements }));
  const setEmail = (email) => setProfile(prev => ({...prev, email}));
  const setPhone = (phone) => setProfile(prev => ({...prev, phone}));
  const setLinkedin = (linkedin) => setProfile(prev => ({...prev, linkedin}));
  const setGithub = (github) => setProfile(prev => ({...prev, github}));
  const setJourney = (journey) => setProfile(prev => ({ ...prev, journey }));


  return (  
    <UserProfileContext.Provider value={{
      profile,
      setCodeforcesHandle,
      setLeetcodeHandle,
      setCodechefHandle,
      setGeeksforgeeksHandle,
      setCoilsHandle,
      setFirstName,
      setLastName,
      setBio,
      setAbout,
      setProjects,
      setPlatformData,
      setEducation,
      setExperience,
      setSkills,
      setAchievements,
      setEmail,
      setPhone,
      setLinkedin,
      setGithub,
      setJourney,
      setProfile, // full overwrite if needed
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
