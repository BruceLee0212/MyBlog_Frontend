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

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [tokenId, setTokenId] = useState();
  const [tokenMsg, setTokenMsg] = useState('');
  const [snackOpen, setSnackOpen] = useState(true);
  const [code, setCode] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
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
  const handleNewPwdChange = (event) => {
    setPasswordsMatch(event.target.value === confirmPwd);
    setNewPwd(event.target.value);
  }
  const handleConfirmPwdChange = (event) => {
    setConfirmPwd(event.target.value);
    setPasswordsMatch(event.target.value === newPwd);
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
  const [errorPwd, setErrorPwd] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!passwordsMatch){
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", newPwd);
    formData.append("tokenId", tokenId);
    formData.append("verificationCode", code);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}change-password`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setError(response.data.error);
          setErrorEmail(response.data.errorEmail);
          setErrorPwd(response.data.errorPwd);
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
        <title>MyBlog-Forget Password</title>
        <link rel="icon" href={icon} />
      </Helmet>
      <Container component="main" maxWidth="xs" sx={{marginTop:'10%'}}>
        <Typography variant="h4" align="center">Forget Password</Typography>
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
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              onChange={handleNewPwdChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Re-Enter Password"
              type="password"
              onChange={handleConfirmPwdChange}
            />
          </Grid>
          {errorPwd && <p style={{ color: 'red', marginLeft: '20px' }}>{errorPwd}</p>}
          {!passwordsMatch && <p style={{ color: 'red', marginLeft: '20px'}}>passwords do not match</p>}
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