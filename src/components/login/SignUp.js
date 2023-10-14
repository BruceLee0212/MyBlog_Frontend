import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import icon from '../../assets/images/blogging.png'
import { Helmet } from 'react-helmet';

const defaultTheme = createTheme();

export default function SignUp() {
    const [errorMsg, setErrorMsg] = useState('');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [preferredName, setPreferredName] = useState("");
    const [email, setEmail] = useState("");
    const [password2, setPassword2] = useState("");
    const [password1, setPassword1] = useState('');
    const [vCode, setVCode] = useState();
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleFistNameChange = (event) => {
      setFirstName(event.target.value);
    }
    const handleLastNameChange = (event) => {
      setLastName(event.target.value);
    }
    const handlePreferredNameChange = (event) => {
      setPreferredName(event.target.value);
    }
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    }
    const handleVCodeChange = (event) => {
      setVCode(event.target.value);
    }
    const handlePassword1Change = (event) => {
      setPasswordsMatch(event.target.value === password2);
      setPassword1(event.target.value);
    }
    const handlePassword2Change = (event) => {
      setPassword2(event.target.value);
      setPasswordsMatch(event.target.value === password1);
    }

    const [errorFName, setErrorFName] = useState('');
    const [errorLName, setErrorLName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const emailValidator = require('email-validator');
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
    const [tokenId, setTokenId] = useState();
    const [tokenMsg, setTokenMsg] = useState('');
    const [snackOpen, setSnackOpen] = useState(true);
    const handleSnackClose = () => {
      setSnackOpen(false);
    }
    useEffect(() => {
      setSnackOpen(true);
    }, [tokenMsg]);
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorFName("");
        setErrorLName("");
        setErrorEmail("");
        setErrorPwd("");
        setErrorMsg("");
        let flag = 0;
        if(firstName.length === 0) {
            setErrorFName("First name can not be null");
            flag++;
        }
        if(lastName.length === 0) {
            setErrorLName("Last name can not be null");
            flag++;
        }
        if(password1.length === 0) {
            setErrorPwd("Password can not be null");
            flag++;
        }
        if(email.length === 0) {
            setErrorEmail("Email can not be null");
            flag++;
        }
        else if(!emailValidator.validate(email)) {
            setErrorEmail("Invalid email address");
            flag++;
        }
        if(flag === 0){
          const formData = new FormData();
          formData.append("firstName", firstName);
          formData.append("lastName", lastName);
          formData.append("preferredName", preferredName);
          formData.append("email", email);
          formData.append("password", password1);
          formData.append("tokenId", tokenId);
          formData.append("verificationCode", vCode);
          try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}signup`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true,
            });
            if (response.status >= 200 && response.status < 300) {
                  if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
                      setErrorMsg(response.data.error);
                  } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
                    const userData = { user: email };
                    sessionStorage.setItem("user", JSON.stringify(userData));
                    window.location.href = response.data.redirect;
                  }
              }
          } catch (error) {
              console.error("error occurred:", error);
          }
      }    
    };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Helmet>
        <title>MyBlog-Sign Up</title>
        <link rel="icon" href={icon} />
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleFistNameChange}
                />
              </Grid>
              {errorFName && <p style={{ color: 'red', marginLeft: '20px' }}>{errorFName}</p>}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleLastNameChange}
                />
              </Grid>
              {errorLName && <p style={{ color: 'red', marginLeft: '20px'}}>{errorLName}</p>}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="preferredName"
                  label="Preferred Name(Optional)"
                  name="preferredName"
                  autoComplete="preferred-name"
                  onChange={handlePreferredNameChange}
                />
              </Grid>
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
                  onChange={handleVCodeChange}
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="new-password"
                  onChange={handlePassword1Change}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Re-Enter Password"
                  type="password"
                  id="password2"
                  onChange={handlePassword2Change}
                />
              </Grid>
              {!passwordsMatch && <p style={{ color: 'red', marginLeft: '20px'}}>passwords do not match</p>}
              {errorPwd && <p style={{ color: 'red', marginLeft: '20px' }}>{errorPwd}</p>}
            </Grid>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {tokenMsg && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity='success'>{tokenMsg}</Alert>
      </Snackbar>}
      </Container>
    </ThemeProvider>
  );
}