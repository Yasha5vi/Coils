// components/NotificationPopper.jsx
import { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import LinearProgress from '@mui/material/LinearProgress';
import { IconRefresh } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { useNotification } from 'contexts/NotificationContext.jsx';
import { useUserProfile } from '../../../../contexts/UserProfileContext';
import { useState } from 'react';
import api from '../../../../api/axios';

export default function NotificationPopper() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);

  const { open, status, message, closeNotification, showNotification } = useNotification();
  
  const {
    profile,
    setProfile,
    setPlatformData
  } = useUserProfile();

  const anchorRef = useRef(null); 

  const handleRefresh = async () => {
    if (
      !profile.codeforcesHandle &&
      !profile.leetcodeHandle &&
      !profile.codechefHandle &&
      !profile.geeksforgeeksHandle
    ) {
      showNotification('info', 'Usernames not provided');
      return;
    }

    try {
      setLoading(true);
      showNotification('loading', 'Fetching latest data ...');

      const res = await api.post('/coils/fetch', {
        ...profile
      });

      if (res.status !== 200) {
        showNotification('error', 'Error fetching data');
        return;
      }

      const data = res.data; // your platform data JSON

      if (
        (!data.leetcode) &&
        (!data.codeforces) &&
        (!data.codechef) &&
        (!data.gfg)
      ) {
        showNotification('error', 'Incorrect handles');
        return;
      }

      // 1. Save platform data in context
      Object.entries(data).forEach(([platform, value]) => {
        setPlatformData(platform, value);
      });

      // 2. Save full profile with updated platformDataJson to localStorage
      const updatedProfile = {
        ...profile,
        platformDataJson: {
          ...profile.platformDataJson,
          ...data
        }
      };
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      showNotification('success', 'Data fetched successfully');
    } catch (err) {
      console.error(err.message);
      showNotification('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Trigger Button */}
      <Box sx={{ ml: 2 }}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            '&:hover': { bgcolor: 'secondary.dark', color: 'secondary.light' },
          }}
          ref={anchorRef}
          onClick={handleRefresh}
        >
          <IconRefresh stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* Notification Popper */}
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [downMD ? 5 : 0, 20] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={closeNotification}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                  sx={{ borderRadius: 3, padding: 2, width: 300, maxWidth: '90vw' }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {status === 'loading'
                        ? 'Loading ... '
                        : status === 'success'
                        ? 'Success' 
                        : status === 'error'
                        ? 'Error'
                        : 'Info'}
                    </Typography>

                    {status === 'loading' ? (
                      <>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: theme.palette.grey[300],
                              '& .MuiLinearProgress-bar': { borderRadius: 4 },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {message}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">{message}</Typography>
                    )}
                  </Stack>
                </MainCard>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
