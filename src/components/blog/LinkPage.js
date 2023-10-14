import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Footer from './Footer';
import Header from './Header';
import Elevator from './Elevator';
import axios from 'axios';
import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import icon from '../../assets/images/blogging.png'
import Link from '@mui/material/Link';

export default function LinkPage() {
  document.body.style.margin='0';
  document.body.style.padding='0';
  const isMountedRef = useRef(true);
  const { author } = useParams();
  const [authorEmail, setAuthorEmail] = useState('');
  const [footerAbout, setFooterAbout] = useState('');
  const [footerCopyRight, setFooterCopyRight] = useState('');
  const [footerPoweredBy, setFooterPoweredBy] = useState('');
  const [footerPoweredByUrl, setFooterPoweredByUrl] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteIcon, setWebsiteIcon] = useState();
  const [github, setGithub] = useState('');
  const [fLinkList, setFLinkList] = useState([]);
  const [rLinkList, setRLinkList] = useState([]);
  const [pLinkList, setPLinkList] = useState([]);
  //get all data from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}blog-link`, {
        params: {
          author: author,
        }
      });
      console.log(response);
      if (isMountedRef.current && response.status === 200) {
        setAuthorEmail(response.data.authorEmail);
        setFooterAbout(response.data.footerConfig.footerAbout);
        setFooterCopyRight(response.data.footerConfig.footerCopyRight);
        setFooterPoweredBy(response.data.footerConfig.footerPoweredBy);
        setFooterPoweredByUrl(response.data.footerConfig.footerPoweredByUrl);
        setWebsiteTitle(response.data.websiteTitle);
        setWebsiteIcon(response.data.websiteIcon);
        setGithub(response.data.github);
        setFLinkList(response.data.fLinkList);
        setRLinkList(response.data.rLinkList);
        setPLinkList(response.data.pLinkList);
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();
    window.scrollTo(0, 0);
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line
  }, []);
  return(
    <Box sx={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Helmet>
        <title>{websiteTitle}</title>
        {websiteIcon === undefined ? <link rel="icon" href={icon} /> : 
        <link rel="icon" href={`data:image/png;base64,${websiteIcon}`} />}
      </Helmet>
      <Header indexPage={`/blog/${author}`} linkPage={`/blog/${author}/links`} githubPage={github}/>
      <Box sx={{margin: '40px'}}>
        {fLinkList && <Box>
          <Typography variant='h4'>Friendly Link</Typography>
          <ul style={{ listStyleType: 'disc' }}>
            {fLinkList
              .sort((a,b) => {
                return b.linkRank - a.linkRank;
              })
              .map((link) => (
                <li key={link.linkId} style={{ display: 'flex', alignItems: 'center' }} sx={{margin: '10px'}}>
                  <Link href={link.linkUrl}>
                      <Typography variant='h6'>{link.linkName}</Typography>
                  </Link>
                  <Typography variant='h6'>&nbsp;-&nbsp;</Typography>
                  <Typography variant='h6'> {link.linkDescription} </Typography>
                </li>
            ))}
          </ul>
        </Box>}
        {rLinkList && <Box sx={{marginTop: '20px'}}>
          <Typography variant='h4'>Recommended Link</Typography>
          <ul style={{ listStyleType: 'disc' }}>
            {rLinkList
              .sort((a,b) => {
                return b.linkRank - a.linkRank;
              })
              .map((link) => (
                <li key={link.linkId} style={{ display: 'flex', alignItems: 'center' }} sx={{margin: '10px'}}>
                  <Link href={link.linkUrl}>
                      <Typography variant='h6'>{link.linkName}</Typography>
                  </Link>
                  <Typography variant='h6'>&nbsp;-&nbsp;</Typography>
                  <Typography variant='h6'> {link.linkDescription} </Typography>
                </li>
              ))}
          </ul>
        </Box>}
        {pLinkList && <Box sx={{marginTop: '20px'}}>
          <Typography variant='h4'>Personal Link</Typography>
          <ul style={{ listStyleType: 'disc' }}>
            {pLinkList
              .sort((a,b) => {
                return b.linkRank - a.linkRank;
              })
              .map((link) => (
                <li key={link.linkId} style={{ display: 'flex', alignItems: 'center' }} sx={{margin: '10px'}}>
                  <Link href={link.linkUrl}>
                      <Typography variant='h6'>{link.linkName}</Typography>
                  </Link>
                  <Typography variant='h6'>&nbsp;-&nbsp;</Typography>
                  <Typography variant='h6'> {link.linkDescription} </Typography>
                </li>
              ))}
          </ul>
        </Box>}
      </Box>
      {authorEmail && <Elevator authorEmail={authorEmail}/>}
      <Footer about={footerAbout} copyRight={footerCopyRight} poweredBy={footerPoweredBy} poweredByUrl={footerPoweredByUrl}/>
    </Box>
  );
}