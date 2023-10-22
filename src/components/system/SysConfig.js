import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useSession } from '../SessionContext';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import blogIcon from '../../assets/images/blogging.png';

export default function SysConfig({refreshHomeData}) {
  // configuration fields
  const sessionData = useSession();
  const [isEditModeFooter, setIsEditModeFooter] = useState(false);
  const [isEditModeProfile, setIsEditModeProfile] = useState(false);
  const [isEditModeWebsite, setIsEditModeWebsite] = useState(false);
  const [isEditModeSite, setIsEditModeSite] = useState(false);
  const [websiteIcon, setWebsiteIcon] = useState();
  const [websiteIconUpdate, setWebsiteIconUpdate] = useState();
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [websiteSubUrl, setWebsiteSubUrl] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [profilePicUpdate, setProfilePicUpdate] = useState();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [pName, setPName] = useState("");
  const [github, setGithub] = useState("");
  const [facebook, setFacebook] = useState("");
  const [x, setX] = useState("");
  const [instagram, setInstagram] = useState("");
  const [footerAbout, setFooterAbout] = useState("");
  const [footerCopyRight, setFooterCopyRight] = useState("");
  const [footerPoweredBy, setFooterPoweredBy] = useState("");
  const [footerPoweredByUrl, setFooterPoweredByUrl] = useState("");
  // get all configuration and default icons from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}configurations`, {
        params: {
          configOwner: sessionData.user
        }
      });
      if (response.status === 200) {
        setWebsiteTitle(response.data.websiteTitle);
        setWebsiteDescription(response.data.websiteDescription);
        setWebsiteSubUrl(response.data.websiteUrl);
        setWebsiteIcon(response.data.webSiteIcon);
        if(response.data.profilePic !== "default"){
          setProfilePic(response.data.profilePicBase64);
        }
        setFName(response.data.fName);
        setLName(response.data.lName);
        setPName(response.data.pName);
        setGithub(response.data.github);
        setFacebook(response.data.facebook);
        setX(response.data.x);
        setInstagram(response.data.instagram);
        setFooterAbout(response.data.footerAbout);
        setFooterCopyRight(response.data.footerCopyRight);
        setFooterPoweredBy(response.data.footerPoweredBy);
        setFooterPoweredByUrl(response.data.footerPoweredByUrl);
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line
    let isMounted = true;
    refreshData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
  // get data from input field 
  const handleSiteTitleChange = (event) => {
    setWebsiteTitle(event.target.value);
  }
  const handleSiteDescription = (event) => {
    setWebsiteDescription(event.target.value);
  }
  const handleSiteSubUrl = (event) => {
    setWebsiteSubUrl(event.target.value);
  }
  const handleFNameChange = (event) => {
    setFName(event.target.value);
  }
  const handleLNameChange = (event) => {
    setLName(event.target.value);
  }
  const handlePNameChange = (event) => {
    setPName(event.target.value);
  }
  const handleGithubChange = (event) => {
    setGithub(event.target.value);
  }
  const handleFacebookChange = (event) => {
    setFacebook(event.target.value);
  }
  const handleXChange = (event) => {
    setX(event.target.value);
  }
  const handleInstagramChange = (event) => {
    setInstagram(event.target.value);
  }
  const handleFooterAboutChange = (event) => {
    setFooterAbout(event.target.value);
  }
  const handleFooterCopyRightChange = (event) => {
    setFooterCopyRight(event.target.value);
  }
  const handleFooterPoweredByChange = (event) => {
    setFooterPoweredBy(event.target.value);
  }
  const handleFooterPoweredByUrlChange = (event) => {
    setFooterPoweredByUrl(event.target.value);
  }
  // upload image form local
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
      setProfilePicUpdate(file)
    }
  };
  // upload website icon form local
  const handleUploadIcon = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setWebsiteIcon(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
      setWebsiteIconUpdate(file)
    }
  };
  // alert for update site config func
  const [updateSiteMessage, setUpdateSiteMessage] = useState("");
  // update site config
  const handleSiteUpdate = async (event) => {
    const formData = new FormData();
    formData.append("configOwner", sessionData.user);
    formData.append("websiteIcon", websiteIconUpdate);
    formData.append("websiteTitle", websiteTitle);
    formData.append("websiteDescription", websiteDescription);
    formData.append("websiteSubUrl", websiteSubUrl);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}configurations/site`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
          setUpdateSiteMessage(response.data.message);
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setIsEditModeSite(false);
    setSiteOpen(true);
  };
  // alert for update profile config func
  const [updateProfileMessage, setUpdateProfileMessage] = useState("");
  const [profilePicError, setProfilePicError] = useState("");
  // update profile config
  const handleProfileUpdate = async (event) => {
    const formData = new FormData();
    formData.append("configOwner", sessionData.user);
    formData.append("profilePic", profilePicUpdate);
    formData.append("fName", fName);
    formData.append("lName", lName);
    formData.append("pName", pName);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}configurations/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          if(response.data.hasOwnProperty('profilePicError')) {
            setProfilePicError(response.data.profilePicError);
          } 
        }
        else {
          setUpdateProfileMessage(response.data.message);

        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setIsEditModeProfile(false);
    setProfileOpen(true);
    refreshData();
    refreshHomeData();
  };
  // alert for update website config func
  const [updateWebsiteMessage, setUpdateWebsiteMessage] = useState("");
  // update website config
  const handleWebsiteUpdate = async (event) => {
    const formData = new FormData();
    formData.append("configOwner", sessionData.user);
    formData.append("github", github);
    formData.append("facebook", facebook);
    formData.append("x", x);
    formData.append("instagram", instagram);
    console.log([...formData.entries()]);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}configurations/website`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setUpdateWebsiteMessage(response.data.message);
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setIsEditModeWebsite(false);
    setWebsiteOpen(true);
  };
  // alert for update footer config func
  const [updateFooterMessage, setUpdateFooterMessage] = useState("");
  // update footer config
  const handleFooterUpdate = async (event) => {
    const formData = new FormData();
    formData.append("configOwner", sessionData.user);
    formData.append("footerAbout", footerAbout);
    formData.append("footerCopyRight", footerCopyRight);
    formData.append("footerPoweredBy", footerPoweredBy);
    formData.append("footerPoweredByUrl", footerPoweredByUrl);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}configurations/footer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        setUpdateFooterMessage(response.data.message);
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setIsEditModeFooter(false);
    setFooterOpen(true);
  };
  //snack bar config
  const[siteOpen, setSiteOpen] = useState(false);
  const[profileOpen, setProfileOpen] = useState(false);
  const[websiteOpen, setWebsiteOpen] = useState(false);
  const[footerOpen, setFooterOpen] = useState(false); 
  const handleSiteClose = () => {
    setSiteOpen(false);
  }
  const handleProfileClose = () => {
    setProfileOpen(false);
  }
  const handleWebsiteClose = () => {
    setWebsiteOpen(false);
  }
  const handleFooterClose = () => {
    setFooterOpen(false);
  }
  return (
    <Box sx={{ overflowX: 'scroll', width: '100%'}}>
      <Box sx={{ display: 'flex', gap: '30px'}}>
        <Card sx={{ flex: '0 0 30%', minWidth: '28%', height:"520px"}} >
          <CardContent>
            <Typography variant="h5" component="div">
              Site Information
            </Typography>
            <br/>
            <Typography variant="h6">
              Site Icon: 
              <br/>
              <img src={websiteIcon ? `data:image/*;base64,${websiteIcon}` : blogIcon} style={{ width: '70px', height: '70px'}} alt="site-icon"/>
              <br/>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadIcon}
                style={{ display: 'none' }}
                id="upload-icon-button"
              />
              <label htmlFor="upload-icon-button">
                <Button 
                  component="span" 
                  variant="contained" 
                  size="small"
                  disabled={!isEditModeSite}
                >
                  Upload
                </Button>
              </label>
            </Typography>
            <br/>
            <Typography variant="h6">
              Site Title: 
              <input
                type="text"
                className="config-input"
                id="site_title"
                defaultValue={websiteTitle}
                disabled={!isEditModeSite}
                onChange={handleSiteTitleChange}
              />
            </Typography>
            <Typography variant="h6">
              Site Description: 
              <input
                type="text"
                className="config-input"
                id="site_description"
                defaultValue={websiteDescription}
                disabled={!isEditModeSite}
                onChange={handleSiteDescription}
              />
              </Typography>
              <Typography variant="h6">
                Site SubUrl: 
                <input
                  type="text"
                  className="config-input"
                  id="site_subUrl"
                  defaultValue={websiteSubUrl}
                  disabled={!isEditModeSite}
                  onChange={handleSiteSubUrl}
                />
              </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => setIsEditModeSite(true)}>Update</Button>
            <Button size="large" onClick={handleSiteUpdate}>Save</Button>
          </CardActions>
        </Card>
        <Card sx={{ flex: '0 0 30%', minWidth: '28%',}}>
          <CardContent>
            <Typography variant="h5" component="div">
              Profile
            </Typography>
            <br/>
            <Typography variant="h6">
              Profile Picture: 
              <Avatar src={profilePic ? `data:image/*;base64,${profilePic}` : null} sx={{ width: 70, height: 70, margin: 1 }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                style={{ display: 'none' }}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <CardActions>
                  <Button 
                    component="span" 
                    variant="contained" 
                    size="small"
                    disabled={!isEditModeProfile}
                  >
                    Upload
                  </Button>
                </CardActions>
              </label>
              {profilePicError && <p className="error-message-inline">{profilePicError}</p>}
            </Typography>
            <Typography variant="h6">
              First Name: 
              <input
                type="text"
                className="config-input"
                id="fName_info"
                defaultValue={fName}
                disabled={!isEditModeProfile}
                onChange={handleFNameChange}
              />
            </Typography>
            <Typography variant="h6">
              Last Name: 
              <input
                type="text"
                className="config-input"
                id="lName_info"
                defaultValue={lName}
                disabled={!isEditModeProfile}
                onChange={handleLNameChange}
              />
            </Typography>
            <Typography variant="h6">
              Preferred Name: 
              <input
                type="text"
                className="config-input"
                id="pName_info"
                defaultValue={pName === "undefined" ? "" : pName}
                disabled={!isEditModeProfile}
                onChange={handlePNameChange}
              />
            </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => setIsEditModeProfile(true)}>Update</Button>
            <Button size="large" onClick={handleProfileUpdate}>Save</Button>
          </CardActions>
        </Card>
        <Card sx={{ flex: '0 0 30%', minWidth: '28%', height:"415px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Website
            </Typography>
            <br/>
            <Typography variant="h6">
              Github: 
              <input
                type="text"
                className="config-input"
                id="github_info"
                defaultValue={github === "undefined" ? "" : github}
                disabled={!isEditModeWebsite}
                onChange={handleGithubChange}
              />
            </Typography>
            <Typography variant="h6">
              Facebook: 
              <input
                type="text"
                className="config-input"
                id="facebook_info"
                defaultValue={facebook === "undefined" ? "" : facebook}
                disabled={!isEditModeWebsite}
                onChange={handleFacebookChange}
              />
            </Typography>
            <Typography variant="h6">
              X: 
              <input
                type="text"
                className="config-input"
                id="x_info"
                defaultValue={x === "undefined" ? "" : x}
                disabled={!isEditModeWebsite}
                onChange={handleXChange}
              />
            </Typography>
            <Typography variant="h6">
              Instagram: 
              <input
                type="text"
                className="config-input"
                id="instagram_info"
                defaultValue={instagram === "undefined" ? "" : instagram}
                disabled={!isEditModeWebsite}
                onChange={handleInstagramChange}
              />
            </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => setIsEditModeWebsite(true)}>Update</Button>
            <Button size="large" onClick={handleWebsiteUpdate}>Save</Button>
          </CardActions>
        </Card>
        <Card sx={{ flex: '0 0 30%', minWidth: '28%', height:"415px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Footer Configuration
            </Typography>
            <br/>
            <Typography variant="h6">
              About: 
              <input
                type="text"
                className="config-input"
                id="footer_about"
                defaultValue={footerAbout}
                disabled={!isEditModeFooter}
                onChange={handleFooterAboutChange}
              />
            </Typography>
            <Typography variant="h6">
              Copy Right: 
              <input
                type="text"
                className="config-input"
                id="footer_copyRight"
                defaultValue={footerCopyRight}
                disabled={!isEditModeFooter}
                onChange={handleFooterCopyRightChange}
              />
            </Typography>
            <Typography variant="h6">
              Powered by: 
              <input
                type="text"
                className="config-input"
                id="footer_poweredBy"
                defaultValue={footerPoweredBy}
                disabled={!isEditModeFooter}
                onChange={handleFooterPoweredByChange}
              />
            </Typography>
            <Typography variant="h6">
              Powered by Url: 
              <input
                type="text"
                className="config-input"
                id="footer_poweredByUrl"
                defaultValue={footerPoweredByUrl}
                disabled={!isEditModeFooter}
                onChange={handleFooterPoweredByUrlChange}
              />
            </Typography>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => setIsEditModeFooter(true)}>Update</Button>
            <Button size="large" onClick={handleFooterUpdate}>Save</Button>
          </CardActions>
        </Card>
      </Box>
      {updateSiteMessage && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={siteOpen}
        onClose={handleSiteClose}
      >
          <Alert severity="success">{updateSiteMessage}</Alert>
      </Snackbar>}
      {updateProfileMessage && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={profileOpen}
        onClose={handleProfileClose}
      >
        <Alert severity="success">{updateProfileMessage}</Alert>
      </Snackbar>}
      {updateWebsiteMessage && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={websiteOpen}
        onClose={handleWebsiteClose}
      >
        <Alert severity="success">{updateWebsiteMessage}</Alert>
      </Snackbar>}
      {updateFooterMessage && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={footerOpen}
        onClose={handleFooterClose}
      >
        <Alert severity="success">{updateFooterMessage}</Alert>
      </Snackbar>}
    </Box>
  );
}