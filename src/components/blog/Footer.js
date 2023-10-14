import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright({copyRight}) {
  return (
    <Typography variant="body2" color="white" align='center'>
      {'© '}
      {new Date().getFullYear()}
      {' '}
      {copyRight}
      {'.'}
    </Typography>
  );
}

function PoweredBy({poweredBy, poweredByUrl}) {
  return(
    <Typography variant="body2" color="white" align='center'>
      {'Powered by '}
      <Link color="inherit" href={poweredByUrl}>
        {poweredBy}
      </Link>
    </Typography>
  );
}

const Footer = ({about, copyRight, poweredBy, poweredByUrl}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="footer"
        sx={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#293548',
          width: '100%',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1" color="white" align="center">
            {about}
          </Typography>
          <Copyright copyRight={copyRight} />
          <PoweredBy poweredBy={poweredBy} poweredByUrl={poweredByUrl} />
        </Container>
      </Box>
    </Box>
  );
}

export default Footer;