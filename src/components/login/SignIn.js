import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import icon from '../../assets/images/blogging.png'
import { Helmet } from 'react-helmet';

const defaultTheme = createTheme();

export default function SignIn() {
  const [errorMsg, setErrorMsg] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data)
      });

      if (response.ok) {
          const result = await response.json(); 
          // Check for the error or redirection URL in the result and handle accordingly
          if (result.error) {
            setErrorMsg(result.error);
            if(result.redirect){
              window.location.href = result.redirect;
            }
          } else if (result.redirect) {
            const userData = { user: data.email };
            sessionStorage.setItem("user", JSON.stringify(userData));
            window.location.href = result.redirect;
          }
      }
    } catch (error) {
      console.error("error occurred:", error);
    }
  };
    return (
        <ThemeProvider theme={defaultTheme}>
        <Helmet>
          <title>MyBlog-Login</title>
          <link rel="icon" href={icon} />
        </Helmet>
        <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link href="/forget-password" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
                </Grid>
            </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
