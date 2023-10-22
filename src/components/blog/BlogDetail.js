import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Footer from './Footer';
import Header from './Header';
import Elevator from './Elevator';
import axios from 'axios';
import MarkdownRenderer from './MarkdownRenderer';
import { Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import ReCAPTCHA from "react-google-recaptcha";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import icon from '../../assets/images/blogging.png'

export default function BlogDetail() {
  document.body.style.margin='0';
  document.body.style.padding='0';
  const isMountedRef = useRef(true);
  const commentHeadingRef = useRef();
  const { author, blogUrl } = useParams();
  const [footerAbout, setFooterAbout] = useState('');
  const [footerCopyRight, setFooterCopyRight] = useState('');
  const [footerPoweredBy, setFooterPoweredBy] = useState('');
  const [footerPoweredByUrl, setFooterPoweredByUrl] = useState('');
  const [footerGithub, setFooterGithub] = useState('');
  const [footerFacebook, setFooterFacebook] = useState('');
  const [footerX, setFooterX] = useState('');
  const [footerInstagram, setFooterInstagram] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteIcon, setWebsiteIcon] = useState();
  const [github, setGithub] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [cProfilePic, setCProfilePic] = useState();
  const [authorName, setAuthorName] = useState('');
  const [authorProfilePic, setAuthorProfilePic] = useState();
  const [blog, setBlog] = useState();
  const [blogContent, setBlogContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogTags, setBlogTags] = useState([]);
  const [blogUpdateTime, setBlogUpdateTime] = useState();
  const [blogViews, setBlogViews] = useState();
  const [blogCommentAllowed, setBlogCommentAllowed] = useState(1);
  //get all data from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}blog-detail`, {
        params: {
          author: author,
          blogUrl: blogUrl
        }
      });
      //console.log(response);
      if (isMountedRef.current && response.status === 200) {
        setFooterAbout(response.data.footerConfig.footerAbout);
        setFooterCopyRight(response.data.footerConfig.footerCopyRight);
        setFooterPoweredBy(response.data.footerConfig.footerPoweredBy);
        setFooterPoweredByUrl(response.data.footerConfig.footerPoweredByUrl);
        setFooterGithub(response.data.websiteConfig.github);
        setFooterFacebook(response.data.websiteConfig.facebook);
        setFooterX(response.data.websiteConfig.x);
        setFooterInstagram(response.data.websiteConfig.instagram);
        setWebsiteTitle(response.data.websiteTitle);
        setWebsiteIcon(response.data.websiteIcon);
        setGithub(response.data.github);
        setBlog(response.data.blog);
        setCommentList(response.data.commentList);
        setCProfilePic(response.data.commentatorProfilePic);
        setAuthorName(response.data.authorName);
        setAuthorProfilePic(response.data.authorProfilePic);
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
  useEffect(() => {
    if (blog) {
      setBlogContent(blog.blogContent);
      setBlogTitle(blog.blogTitle);
      setBlogTags(blog.blogTags.split(','));
      const updateTime = new Date(blog.updateTime);
      const formattedTime = updateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      setBlogUpdateTime(formattedTime);
      setBlogViews(blog.blogViews);
      setBlogCommentAllowed(blog.enableComment);
    }
  },[blog])
  const[cName, setCName] = useState('');
  const[cEmail, setCEmail] = useState('');
  const[cContent, setCContent] = useState('');
  const handleCNameChange = (event) => {
    setCName(event.target.value);
  }
  const handleCEmailChange = (event) => {
    setCEmail(event.target.value);
  }
  const handleCContentChange = (event) => {
    setCContent(event.target.value);
  }
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const handleCaptchaVerify = () => {
    setIsCaptchaVerified(true);
  };
  const [snackOpen, setSnackOpen] = useState(true);
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  const[blogError, setBlogError] = useState('');
  const[nameError, setNameError] = useState('');
  const[contentError, setContentError] = useState('');
  const[dbError, setDbError] = useState('');
  const[successMsg, setSuccessMsg] = useState('');
  const clearInput = () => {
    setCName('');
    setCEmail('');
    setCContent('');
  }
  const handleSubmitClick = async (event) => {
    const formData = new FormData();
    formData.append("blogId", blog.blogId);
    formData.append("cName", cName);
    formData.append("cEmail", cEmail);
    formData.append("cContent", cContent);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}add-comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed'){
          if (response.data.hasOwnProperty('blogError')){
            setBlogError(response.data.blogError);
          }
          if (response.data.hasOwnProperty('nameError')){
            setNameError(response.data.nameError);
          }
          if (response.data.hasOwnProperty('contentError')){
            setContentError(response.data.contentError);
          }
          if (response.data.hasOwnProperty('dbError')){
            setDbError(response.data.dbError);
          }
        }
        else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded'){
          setSnackOpen(true);
          setSuccessMsg("Success! Your comment will be displayed after approved");
          clearInput();
          refreshData();
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
  };
  const handleCommentHeadingClick = () => {
    commentHeadingRef.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Helmet>
        <title>{websiteTitle}</title>
        {websiteIcon === undefined ? <link rel="icon" href={icon} /> : 
        <link rel="icon" href={`data:image/png;base64,${websiteIcon}`} />}
      </Helmet>
      <Header indexPage={`/blog/${author}`} linkPage={`/blog/${author}/links`} githubPage={github}/>
      {blog && <Box>
        <Typography variant='h4' sx={{margin: '20px'}}>
          {blogTitle}
        </Typography>
        <Box sx={{marginLeft: '20px'}}>
        <Typography variant='h5' style={{ display: 'inline-block' }} sx={{marginRight: '20px', fontStyle: 'italic'}}>
          {blogUpdateTime}
        </Typography>
        <Typography  onClick={handleCommentHeadingClick} variant='h5' style={{ display: 'inline-block', cursor: 'pointer' }} sx={{marginRight: '20px', fontStyle: 'italic'}}>
          {commentList.length} comments
        </Typography>
        <Typography variant='h5' style={{ display: 'inline-block' }} sx={{fontStyle: 'italic'}}>
          {blogViews} views
        </Typography>
        </Box>
        <br />
        {blogTags.map((tag, index) => (
          <Chip sx={{marginLeft: '20px'}} key={index} label={tag} />
        ))}
      </Box>}
      <Box sx={{margin: '40px'}}>
        {blog && <MarkdownRenderer markdown={blogContent} />}
        <Divider />
          <Typography ref={commentHeadingRef} variant='h5' sx={{margin: '20px'}}>Comments</Typography>
          {commentList && commentList
          .sort((a,b) => {
            const dateA = new Date(a['commentCreateTime']);
            const dateB = new Date(b['commentCreateTime']);
            return dateB - dateA;
          })
          .map((comment) => (
            <Box key={comment.commentId}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={comment.email && cProfilePic && cProfilePic.hasOwnProperty(comment.email) ? `data:image/*;base64,${cProfilePic[comment.email]}` : null} sx={{ width: 35, height: 35, margin: 1 }} />
                <Typography sx={{fontWeight: 'bold', marginRight: '10px'}}>{comment.commentator}</Typography>
                <Typography sx={{color: '#ccc'}}>{format(new Date(comment.commentCreateTime), 'MM/dd/yyyy')}</Typography>
              </Box>
              <Box>
                <Typography sx={{marginLeft: '35px'}}>{comment.commentBody}</Typography>
              </Box>
              {comment.replyBody && <Box sx={{marginLeft: '35px'}}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={authorProfilePic ? `data:image/*;base64,${authorProfilePic}` : null} sx={{ width: 35, height: 35, margin: 1 }} />
                  <Typography sx={{fontWeight: 'bold', marginRight: '10px'}}>{authorName}</Typography>
                  <Typography sx={{color: '#ccc'}}>{format(new Date(comment.replyCreateTime), 'MM/dd/yyyy')}</Typography>
                </Box>
                <Box>
                  <Typography sx={{marginLeft: '35px'}}>{comment.replyBody}</Typography>
                </Box>  
              </Box>}

            </Box>
          ))}
        <Divider />
        {blogCommentAllowed === 1 && <Box sx={{marginTop:'10px'}}>
          <Typography variant='h5' align='center'>
            {'Add a Comment'}
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            size="small" 
            value={cName}
            sx={{marginTop: '20px'}}
            onChange={handleCNameChange}
          />
          {nameError && <p className="error-message-inline">{nameError}</p>}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            value={cEmail}
            sx={{marginTop: '10px'}}
            onChange={handleCEmailChange}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            size="small" 
            value={cContent}
            sx={{marginTop: '10px', marginBottom: '10px'}}
            onChange={handleCContentChange}
          />
          {contentError && <p className="error-message-inline">{contentError}</p>}
          {blogError && <p className="error-message-inline">{blogError}</p>}
          {dbError && <p className="error-message-inline">{dbError}</p>}
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
            hl="en"
            onChange={handleCaptchaVerify}
          />
          <Button size="large" onClick={handleSubmitClick} disabled={!isCaptchaVerified} sx={{ marginTop: '10px' }}>
            Submit
          </Button>
        </Box>}
      </Box>
      {blog && <Elevator authorEmail={blog.blogOwner}/>}
      <Footer about={footerAbout} copyRight={footerCopyRight} poweredBy={footerPoweredBy} poweredByUrl={footerPoweredByUrl} footerGithub={footerGithub} footerFacebook={footerFacebook} footerX={footerX} footerInstagram={footerInstagram}/>
      {successMsg && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity='success'>{successMsg}</Alert>
      </Snackbar>}
    </Box>
  );
}