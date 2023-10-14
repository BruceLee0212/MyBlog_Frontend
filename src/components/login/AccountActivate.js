import React, { useState, useEffect }from "react";
import Box from '@mui/material/Box';
import axios from 'axios';
import icon from '../../assets/images/blogging.png'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';

export default function AccountActivate() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [tokenId, setTokenId] = useState();
  const [tokenMsg, setTokenMsg] = useState('');
  const [snackOpen, setSnackOpen] = useState(true);
  const [code, setCode] = useState('');
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  useEffect(() => {
    setSnackOpen(true);
  }, [tokenMsg]);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  }
  // set a count down module
  const [isSendCodeButtonDisabled, setIsSendCodeButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const handleVarificationButtonClick = () => {
    sendVerificationCode();
    setIsSendCodeButtonDisabled(true);
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsSendCodeButtonDisabled(false);
      setCountdown(60);
    }, 60000);
  }
  useEffect(() => {
    if (countdown === 0) {
      setIsSendCodeButtonDisabled(false);
    }
  }, [countdown]);
  const sendVerificationCode = async (event) => {
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}confirmation`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if(response.data.hasOwnProperty('status') && response.data.status === 'failed'){
          setErrorEmail(response.data.errorEmail);
        }
        else{
          setTokenId(response.data.tokenId);
          setTokenMsg(response.data.message);
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
  }
  const [error, setError] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("tokenId", tokenId);
    formData.append("verificationCode", code);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}account-activate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setError(response.data.error);
          setErrorEmail(response.data.errorEmail);
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error("error occurred:", error);
    }   
};

  return(
    <Box>
      <Helmet>
        <title>MyBlog-Account Activate</title>
        <link rel="icon" href={icon} />
      </Helmet>
      <Container component="main" maxWidth="xs" sx={{marginTop:'10%'}}>
        <Typography variant="h4" align="center">Account Activate</Typography>
        <Typography variant="h6" align="center" color={'red'}>Your account has not activated yet</Typography>
        <Grid container spacing={2} sx={{marginTop: '20px'}}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={handleEmailChange}
            />
          </Grid>
          {errorEmail && <p style={{ color: 'red', marginLeft: '20px' }}>{errorEmail}</p>}
          <Grid item xs={12}>
            <TextField
              required
              id="emailVerification"
              label="Verification code"
              name="emailVerification"
              onChange={handleCodeChange}
            />
            <Button 
              variant="contained" 
              sx={{marginTop:"10px", marginLeft:"50px",width:"120px", height:"36px"}}
              onClick={handleVarificationButtonClick}
              disabled={isSendCodeButtonDisabled}
            >
              {isSendCodeButtonDisabled ? `${countdown}s` : 'Get Code'}
            </Button>
          </Grid>
          {error && <p style={{ color: 'red', marginLeft: '20px' }}>{error}</p>}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Container>
      {tokenMsg && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity='success'>{tokenMsg}</Alert>
      </Snackbar>}
    </Box>
  );
}