import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import api from '../../../api/axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useUserProfile } from '../../../contexts/UserProfileContext';

// ===========================|| JWT - REGISTER ||=========================== //

export default function AuthRegister() {
  const theme = useTheme();
  const {login,isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const [email, setFormEmail] = useState('');
  const [username, setFormUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError,setShowError] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const { setProfile } = useUserProfile();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async ()=>{

    if(username.length == 0 || password.length == 0 || email.length == 0){
      setShowError(true);
      setErrorMessage('Fields can not be empty');
      setTimeout(()=>{
        setShowError(false);
        setErrorMessage('');
      },5000);
      return;
    }

    const isValidEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    
    if(!isValidEmail){
      setShowError(true);
      setErrorMessage('Invalid Email');
      setTimeout(()=>{
        setShowError(false);
        setErrorMessage('');
      },5000);
      return;
    }

    try{
      const response = await api.post("/auth/register",{
        email,
        username,
        password
      })
      const token = response?.data?.token;
      const fetchedProfile = response?.data?.profile;
      if(token){
        setProfile(fetchedProfile);
        login(token,fetchedProfile);
      }else{
        setShowError(true);
        setErrorMessage("Invalid response from server");
        setTimeout(() =>{
          setShowError(false);
          setErrorMessage('');
        }, 5000);
      }
    }catch(error){
      const errorMsg = error?.response?.status === 403
        ? "Please try a different username"
        : "Something went wrong. Please try again later.";

      setShowError(true);
      setErrorMessage(errorMsg);
      setTimeout(() =>{
        setShowError(false);
        setErrorMessage('');
      }, 5000);
    }
  };

  useEffect(()=>{
    if (isAuthenticated) {
      navigate('/', { replace: true }); 
    }
  },[navigate,isAuthenticated])

  return (
    <>
      <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }} size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      {showError &&  (
        <Typography color="error" sx={{ marginLeft: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-register">Email Address </InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-register"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setFormEmail(event.target.value)}
          inputProps={{}}
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="text"
          name="username"
          value={username}
          onChange={(event) => setFormUsername(event.target.value)}
          inputProps={{}}
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          label="Password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          inputProps={{}}
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label={
              <Typography variant="subtitle1">
                Agree with &nbsp;
                <Typography variant="subtitle1" component={Link} to="#">
                  Terms & Condition.
                </Typography>
              </Typography>
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button 
            disableElevation 
            fullWidth 
            size="large" 
            type="submit" 
            variant="contained" 
            color="secondary"
            onClick = {handleRegister}
          >
            Sign up
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
