// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import { useUserProfile } from '../../../../contexts/UserProfileContext';
import { useAuth } from '../../../../contexts/AuthContext';

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

export default function UpgradePlanCard() {

  const { profile } = useUserProfile();
  const { user , roles } = useAuth(); 

  const cardSX = {
    content: '""',
    position: 'absolute',
    width: 200,
    height: 200,
    borderColor: 'warning.main'
  };

  return (
    <Card
      sx={{
        bgcolor: 'warning.light',
        my: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          border: '19px solid ',
          borderRadius: '50%',
          top: '65px',
          right: '-150px',
          ...cardSX
        },
        '&:before': {
          border: '3px solid ',
          borderRadius: '50%',
          top: '145px',
          right: '-70px',
          ...cardSX
        }
      }}
    >
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid container direction="row" >
            <Typography variant="h3">Hi  {' '+user}</Typography>
          </Grid>
          <Grid>
            <Typography variant="p">{profile.bio?.length > 0?profile.bio:"Please set your bio in settings"}</Typography>
          </Grid>
          <Grid>
            <Stack direction="row">
              <AnimateButton>
                <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }}>
                  {roles.length > 1 ? 'Admin' : 'Member'}
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
