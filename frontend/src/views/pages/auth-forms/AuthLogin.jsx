import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl, { formControlClasses } from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../../../contexts/AuthContext';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// api
import api from '../../../api/axios';
import { useUserProfile } from '../../../contexts/UserProfileContext';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);
  const [username,setFormUsername] = useState('');
  const [password,setPassword] = useState('');
  const [showError,setShowError] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const { login,isAuthenticated,user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const { setProfile } = useUserProfile();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    if(username.length == 0 || password.length == 0){
      setShowError(true);
      setErrorMessage('Fields can not be empty')
      setTimeout(()=>{
        setShowError(false);
        setErrorMessage('');
      },5000);
      return;
    }

    try {
      const response = await api.post("/auth/login",{
        username,
        password
      });
 
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
    } catch (error) {
      // console.error("Login failed:", error);

      const errorMsg = error?.response?.status === 403
        ? "Invalid credentials or user not exits"
        : "Something went wrong. Please try again later.";

      setShowError(true);
      setErrorMessage(errorMsg);
      setTimeout(() =>{
        setShowError(false);
        setErrorMessage('');
      }, 5000);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true }); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {showError &&  (
        <Typography color="error" sx={{ marginLeft: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
        <OutlinedInput 
          id="outlined-adornment-email-login" 
          type="text" 
          name="username" 
          value={username}
          onChange = {(event)=>setFormUsername(event.target.value)}
          inputProps={{}} />
      </FormControl>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          name="password"
          onChange={(event)=> setPassword(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                value={password}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          inputProps={{}}
          label="Password"
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          />
        </Grid>
        <Grid>
          <Typography variant="subtitle1" component={Link} to="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
            Forgot Password?
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button 
            color="secondary" 
            fullWidth size="large" 
            type="submit" 
            variant="contained"
            onClick={handleSubmit}>
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
