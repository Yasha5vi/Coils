// material-ui
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Box,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material';
import Grid from "@mui/material/Grid";
import SaveIcon from '@mui/icons-material/Save';

// hooks & context
import { useState, useEffect } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useNotification } from '../../contexts/NotificationContext';

// components
import MainCard from 'ui-component/cards/MainCard';
import api from '../../api/axios';

export default function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);

  const [leetcodeLocal, setLeetcodeLocal] = useState('');
  const [codeforcesLocal, setCodeforcesLocal] = useState('');
  const [codechefLocal, setCodechefLocal] = useState('');
  const [gfgLocal, setGfgLocal] = useState('');
  const [manualStats, setManualStats] = useState({
  leetcode: { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 },
  codeforces: { rating: 0 },
  codechef: { stars: 0, rating: 0 },
  gfg: { totalProblemsSolved: 0 }
});


  const {
    profile,
    setFirstName,
    setLastName,
    setBio,
    setEmail,
    setPhone,
    setEducation,
    setSkills,
    setGithub,
    setLinkedin,
    setExperience,
    setProfile,
    setCodeforcesHandle,
    setLeetcodeHandle,
    setCodechefHandle,
    setGeeksforgeeksHandle,
  } = useUserProfile();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/;
  const setNum = (v) => (v === '' ? 0 : Number(v));

const updateStat = (platform, key, value) => {
  setManualStats((prev) => ({
    ...prev,
    [platform]: {
      ...prev[platform],
      [key]: setNum(value)
    }
  }));
};

  const handleSubmit = async () => {
    if (!profile.firstName?.trim() || !profile.lastName?.trim() ||
      !profile.education?.trim() || !profile.experience?.trim() ||
      !profile.skills?.trim()) {
      showNotification('error', 'Please fill all the required fields');
      return;
    }

    if (!profile.email || !emailRegex.test(profile.email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    if (!profile.phone || !phoneRegex.test(profile.phone)) {
      showNotification('error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (profile.github && !urlRegex.test(profile.github)) {
      showNotification('error', 'GitHub URL must be valid');
      return;
    }

    if (profile.linkedin && !urlRegex.test(profile.linkedin)) {
      showNotification('error', 'LinkedIn URL must be valid');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      showNotification('loading', 'Updating Profile...');
      const response = await api.post('/profile/update', { ...profile });
      if (response.status !== 200) throw new Error('Failed to update profile');

      setProfile(response.data);
      localStorage.setItem('profile', JSON.stringify(response.data));
      showNotification('success', 'Profile updated successfully');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  if (loading) return;

  try {
    setLoading(true);
    showNotification('loading', 'Updating handles and stats...');

    const res = await api.post('/profile/update', {
      ...profile,
      codeforcesHandle: codeforcesLocal,
      leetcodeHandle: leetcodeLocal,
      codechefHandle: codechefLocal,
      geeksforgeeksHandle: gfgLocal,
      platformDataJson: manualStats
    });

    if (res.status !== 200) throw new Error('Failed to update profile');

    setCodeforcesHandle(res.data.codeforcesHandle ?? '');
    setCodeforcesLocal(res.data.codeforcesHandle ?? '');

    setLeetcodeHandle(res.data.leetcodeHandle ?? '');
    setLeetcodeLocal(res.data.leetcodeHandle ?? '');

    setCodechefHandle(res.data.codechefHandle ?? '');
    setCodechefLocal(res.data.codechefHandle ?? '');

    setGeeksforgeeksHandle(res.data.geeksforgeeksHandle ?? '');
    setGfgLocal(res.data.geeksforgeeksHandle ?? '');

    setProfile(res.data);
    localStorage.setItem('profile', JSON.stringify(res.data));
    showNotification('success', 'Handles and stats updated successfully');
  } catch (err) {
    console.error(err);
    showNotification('error', 'Something went wrong!');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  setCodeforcesLocal(profile?.codeforcesHandle ?? '');
  setLeetcodeLocal(profile?.leetcodeHandle ?? '');
  setCodechefLocal(profile?.codechefHandle ?? '');
  setGfgLocal(profile?.geeksforgeeksHandle ?? '');

  const pd = profile?.platformDataJson || {};
  setManualStats({
    leetcode: {
      totalSolved: pd?.leetcode?.totalSolved ?? 0,
      easySolved: pd?.leetcode?.easySolved ?? 0,
      mediumSolved: pd?.leetcode?.mediumSolved ?? 0,
      hardSolved: pd?.leetcode?.hardSolved ?? 0
    },
    codeforces: { rating: pd?.codeforces?.rating ?? 0 },
    codechef: { stars: pd?.codechef?.stars ?? 0, rating: pd?.codechef?.rating ?? 0 },
    gfg: { totalProblemsSolved: pd?.gfg?.totalProblemsSolved ?? 0 }
  });
}, [profile]);

  return (
    <>
      <MainCard title="Settings" sx={{ mb: 3 }}>
        {/* Name Fields */}
        <Grid container direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Grid container direction={isMobile ? "column" : "row"} justifyContent={isMobile ? "flex-start" : "space-between"} sx={{ width: isMobile ? "100%" : "60%" }}>
            <Box sx={{ width: isMobile ? "100%" : "48%" }}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="first-name">First Name</InputLabel>
                <OutlinedInput id="first-name" type="text" name="firstName" value={profile.firstName ?? ''} onChange={(e) => setFirstName(e.target.value)} />
              </FormControl>
            </Box>
            <Box sx={{ width: isMobile ? "100%" : "48%" }}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="last-name">Last Name</InputLabel>
                <OutlinedInput id="last-name" type="text" name="lastName" value={profile.lastName ?? ''} onChange={(e) => setLastName(e.target.value)} />
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Bio */}
        <Grid container direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="bio">Enter your Bio</InputLabel>
              <OutlinedInput id="bio" type="text" name="Bio" value={profile.bio ?? ''} onChange={(e) => setBio(e.target.value)} />
            </FormControl>
          </Grid>
        </Grid>

        {/* Email & Phone */}
        <Grid container direction={isMobile ? "column" : "row"} alignItems="center" sx={{ width: "100%" }}>
          <Grid container direction={isMobile ? "column" : "row"} justifyContent={isMobile ? "flex-start" : "space-between"} sx={{ width: isMobile ? "100%" : "60%" }}>
            <Box sx={{ width: isMobile ? "100%" : "48%" }}>
              <FormControl disabled fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput id="email" type="email" name="Email" value={profile.email ?? ''} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
            </Box>
            <Box sx={{ width: isMobile ? "100%" : "48%" }}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="phone">Phone</InputLabel>
                <OutlinedInput id="phone" type="tel" name="Phone" value={profile.phone ?? ''} onChange={(e) => setPhone(e.target.value)} />
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Education */}
        <Grid container direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="education">Education</InputLabel>
              <OutlinedInput id="education" type="text" name="Education" value={profile.education ?? ''} onChange={(e) => setEducation(e.target.value)} />
            </FormControl>
          </Grid>
        </Grid>

        {/* Experience */}
        <Grid container direction="row" alignItems="center" sx={{ width: "100%", mt: 1, mb: 1 }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ height: "100%" }}>
              <InputLabel id="experience-label">Experience</InputLabel>
              <Select labelId="experience-label" id="experience" value={profile.experience ?? ''} onChange={(e) => setExperience(e.target.value)} sx={{ p: 0.65 }}>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="0-2 yrs">0-2 yrs</MenuItem>
                <MenuItem value="2-4 yrs">2-4 yrs</MenuItem>
                <MenuItem value="4-6 yrs">4-6 yrs</MenuItem>
                <MenuItem value="6-8 yrs">6-8 yrs</MenuItem>
                <MenuItem value="8+ yrs">8+ yrs</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Skills */}
        <Grid container direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="skills">Enter your Skills</InputLabel>
              <OutlinedInput id="skills" type="text" name="Skills" value={profile.skills ?? ''} onChange={(e) => setSkills(e.target.value)} />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="skills">LinkedIn URL</InputLabel>
              <OutlinedInput id="skills" type="text" name="Skills" value={profile.linkedin ?? ''} onChange={(e) => setLinkedin(e.target.value)} />
            </FormControl>
          </Grid>
        </Grid>

        {/* GitHub & LinkedIn */}
        <Grid container direction={isMobile ? "column" : "row"} alignItems="center" sx={{ width: "100%" }}>
          <Grid sx={{ width: isMobile ? "100%" : "60%" }}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="github">GitHub URL</InputLabel>
              <OutlinedInput id="github" type="url" name="github" value={profile.github ?? ''} onChange={(e) => setGithub(e.target.value)} />
            </FormControl>
          </Grid>

          <Grid sx={{ width: isMobile ? "100%" : "40%", mt: isMobile ? 2 : 0, display: "flex", justifyContent: "center" }}>
            <Button size="large" variant="contained" color="secondary" sx={{ borderRadius: 2, width: isMobile ? "100%" : "50%" }} onClick={handleSubmit}>Save</Button>
          </Grid>
        </Grid>
      </MainCard>

      {/* Handles Section */}
      <MainCard title="Update your Handles">
        {[
          { label: 'Leetcode', value: leetcodeLocal, setValue: setLeetcodeLocal, id: 'leetcode' },
          { label: 'Codeforces', value: codeforcesLocal, setValue: setCodeforcesLocal, id: 'codeforces' },
          { label: 'Codechef', value: codechefLocal, setValue: setCodechefLocal, id: 'codechef' },
          { label: 'Geeks For Geeks', value: gfgLocal, setValue: setGfgLocal, id: 'gfg' }
        ].map((handle) => (
          <Grid key={handle.id} container direction="row" alignItems="center" justifyContent={isMobile ? "space-between" : ""} sx={{ width: "100%", mb: 2 }}>
            <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor={handle.id}>{handle.label} Username</InputLabel>
                <OutlinedInput id={handle.id} type="text" name={`${handle.id}Handle`} value={handle.value} onChange={(e) => handle.setValue(e.target.value)} />
              </FormControl>
            </Grid>
          </Grid>
          
        ))}
       

        <Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="lc-total">LeetCode Total Solved</InputLabel>
      <OutlinedInput id="lc-total" type="number" value={manualStats.leetcode.totalSolved} onChange={(e) => updateStat('leetcode', 'totalSolved', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="lc-easy">LeetCode Easy</InputLabel>
      <OutlinedInput id="lc-easy" type="number" value={manualStats.leetcode.easySolved} onChange={(e) => updateStat('leetcode', 'easySolved', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="lc-medium">LeetCode Medium</InputLabel>
      <OutlinedInput id="lc-medium" type="number" value={manualStats.leetcode.mediumSolved} onChange={(e) => updateStat('leetcode', 'mediumSolved', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="lc-hard">LeetCode Hard</InputLabel>
      <OutlinedInput id="lc-hard" type="number" value={manualStats.leetcode.hardSolved} onChange={(e) => updateStat('leetcode', 'hardSolved', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="cf-rating">Codeforces Rating</InputLabel>
      <OutlinedInput id="cf-rating" type="number" value={manualStats.codeforces.rating} onChange={(e) => updateStat('codeforces', 'rating', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="cc-stars">CodeChef Stars</InputLabel>
      <OutlinedInput id="cc-stars" type="number" value={manualStats.codechef.stars} onChange={(e) => updateStat('codechef', 'stars', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="cc-rating">CodeChef Rating</InputLabel>
      <OutlinedInput id="cc-rating" type="number" value={manualStats.codechef.rating} onChange={(e) => updateStat('codechef', 'rating', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>

<Grid container direction="row" alignItems="center" sx={{ width: "100%", mb: 2 }}>
  <Grid sx={{ width: isMobile ? "75%" : "60%" }}>
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel htmlFor="gfg-total">GFG Total Solved</InputLabel>
      <OutlinedInput id="gfg-total" type="number" value={manualStats.gfg.totalProblemsSolved} onChange={(e) => updateStat('gfg', 'totalProblemsSolved', e.target.value)} />
    </FormControl>
  </Grid>
</Grid>
 <Grid container sx={{ width: '100%', mt: 1 }}>
  <Grid sx={{ width: isMobile ? '100%' : '60%', display: 'flex', justifyContent: 'flex-end' }}>
    {isMobile ? (
      <IconButton
        color="secondary"
        onClick={handleSave}
        sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
      >
        <SaveIcon />
      </IconButton>
    ) : (
      <Button size="large" variant="contained" color="secondary" sx={{ borderRadius: 2 }} onClick={handleSave}>
        Save Handles + Stats
      </Button>
    )}
  </Grid>
</Grid>
      </MainCard>
    </>
  );
}
