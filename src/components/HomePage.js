import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import axios from 'axios';
import Link from '@mui/material/Link';
import { Helmet } from 'react-helmet';
//import icons
import { Dashboard2 as DashboardIcon } from '@styled-icons/remix-fill/Dashboard2';
import { Blog as NewBlogIcon} from '@styled-icons/icomoon/Blog';
import { Blogger as BlogIcon } from '@styled-icons/boxicons-logos/Blogger';
import { Comment as CommentIcon } from '@styled-icons/boxicons-regular/Comment';
import { Category as CategoryIcon } from '@styled-icons/boxicons-regular/Category';
import { Tags as TagIcon } from '@styled-icons/bootstrap/Tags';
import { Link as LinkIcon } from '@styled-icons/entypo/Link';
import { SettingsOutline as SysConfigIcon } from '@styled-icons/evaicons-outline/SettingsOutline';
import { LockPassword as PwdUpdateIcon } from '@styled-icons/remix-line/LockPassword';
import { LogOut as LogOutIcon } from '@styled-icons/boxicons-regular/LogOut';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
//import management modules
import BlogMng from './management/BlogMng'
import CategoryMng from './management/CategoryMng'
import CommentMng from './management/CommentMng'
import LinkMng from './management/LinkMng'
import TagMng from './management/TagMng'
//import dashboard modules
import DashBoard from './dashbord/DashBoard'
import NewBlog from './dashbord/NewBlog'
//import system configuration modules
import SysConfig from './system/SysConfig'
import PwdUpdate from './system/PwdUpdate'
import icon from '../assets/images/blogging.png'

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function HomePage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [profilePic, setProfilePic] = useState();
  const [websiteIcon, setWebsiteIcon] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [blogCount, setBlogCount]=useState(0);
  const [blogUrl, setBlogUrl] = useState('');
  // get all blogs from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}profile`, {
        params: {
          user: JSON.parse(sessionStorage.getItem("user")).user
        }
      });
      console.log(response);
      if (response.status === 200) {
        if (response.data.status === 'failed'){
          setErrorMsg(response.data.message);
        }
        else{
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setPreferredName(response.data.preferredName);
          setProfilePic(response.data.profilePic);
          setWebsiteIcon(response.data.websiteIcon);
          setBlogCount(response.data.blogCount);
          setBlogUrl(response.data.blogUrl);
        }
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
  // handle login error
  const [loginErrorOpen, setLoginErrorOpen] = useState(true);
  const handleLoginErrorDialogClose = () => {
    setLoginErrorOpen(false);
  } 
  // sidebar setting
  const [open, setOpen] = useState(true);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Dashboard'); // Initialize with default item
  const [selectedContentItem, setSelectedContentItem] = useState('Dashboard'); // Initialize with default item
  // blog for update from blog management page
  const [selectedBlog, setSelectedBlog] = useState();
  // ListItem items for the dashboard
  const DashboardItems = [
      { label: 'Dashboard', icon: <DashboardIcon size='24' />, content: 'Dashboard', setSelectedSidebarItem : setSelectedSidebarItem, setSelectedContentItem : setSelectedContentItem },
      { label: 'NewBlog', icon: <NewBlogIcon size='24' />, content: 'New Blog', selectedBlog: selectedBlog, setSelectedSidebarItem : setSelectedSidebarItem, setSelectedContentItem : setSelectedContentItem },
  ];
  const ManagementItems = [
      { label: 'BlogMng', icon: <BlogIcon size='24' />, content: 'Blog Management', setSelectedSidebarItem : setSelectedSidebarItem, setSelectedContentItem : setSelectedContentItem, setSelectedBlog : setSelectedBlog },
      { label: 'CommentMng', icon: <CommentIcon size='24' />, content: 'Comment Management' },
      { label: 'CategoryMng', icon: <CategoryIcon size='24' />, content: 'Category Management' },
      { label: 'TagMng', icon: <TagIcon  size='24'/>, content: 'Tag Management' },
      { label: 'LinkMng', icon: <LinkIcon  size='24'/>, content: 'Link Management' },
  ];
  const SystemItems = [
      { label: 'SysConfig', icon: <SysConfigIcon size='24' />, content: 'System Configuration', refreshHomeData : refreshData },
      { label: 'PwdUpdate', icon: <PwdUpdateIcon size='24' />, content: 'Password Update' },
  ];
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };
  // open/close the sidebar
  const toggleDrawer = () => {
      setOpen(!open);
  };
  // confirmation page for drawer switch
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleOpenConfirmationDialog = () => {
    setConfirmDialogOpen(true);
  };
  const handleCloseConfirmationDialog = () => {
    setConfirmDialogOpen(false);
  };
  const [nextSidebarItem, setNextSidebarItem] = useState('');
  const [nextContentItem, setNextContentItem] = useState('');
  const handleConfirmLeaveNewBlog = () => {
    setSelectedSidebarItem(nextSidebarItem);
    setSelectedContentItem(nextContentItem);
    setConfirmDialogOpen(false);
  };
  // click item from the sidebar and display related content
  const handleSidebarItemClick = (item) => {
    if (selectedSidebarItem === 'NewBlog') {
      setNextSidebarItem(item);
      setNextContentItem(item);
      handleOpenConfirmationDialog();
    } else {
      setSelectedSidebarItem(item);
      setSelectedContentItem(item);
    }
  };
  // Map of content components
  const contentMap = {
      Dashboard: <DashBoard />,
      NewBlog: <NewBlog />,
      BlogMng: <BlogMng />,
      CommentMng: <CommentMng />,
      CategoryMng: <CategoryMng />,
      TagMng: <TagMng />,
      LinkMng: <LinkMng />,
      SysConfig: <SysConfig />,
      PwdUpdate: <PwdUpdate />,
  };
  const[dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  }
  const handleDirectToIndexPage = () => {
    if(blogCount !== 0){
      navigate(`/blog/${blogUrl}`);
    }
    else{
      setDialogOpen(true);
    }
  }
  useEffect(() => {
    console.log(websiteIcon === undefined);
  },[websiteIcon])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Helmet>
        <title>MyBlog-HomePage</title>
        {websiteIcon === undefined ? <link rel="icon" href={icon} /> : 
        <link rel="icon" href={`data:image/png;base64,${websiteIcon}`} />}
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
          <AppBar position="absolute" open={open} >
            <Toolbar sx={{ pr: '24px' }} >
              {!open && (
                <Tooltip title={<span>Display menu</span>}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                    }}
                  >
                      <MenuIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
              >
                  Home
              </Typography>
              <Tooltip title={<span>Go to your blog</span>}>
                <IconButton color="inherit" onClick={handleDirectToIndexPage}>
                  <p style={{ fontSize: "15px", marginRight: "2px" }}>Blog</p>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
              }}
            >
              <Tooltip title={<span>Hide menu</span>}>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={profilePic ? `data:image/*;base64,${profilePic}` : null} sx={{ width: 55, height: 55, margin: 1 }} />
              <span className="name" style={{fontSize: 20, fontWeight: 'bold'}}>
                {preferredName !== "undefined" && 
                preferredName !== "" && 
                preferredName !== null &&
                preferredName !== undefined ? preferredName : `${firstName} ${lastName}`}
              </span>
            </div>
            <Divider />
            <List component="nav">
                {DashboardItems.map((item, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleSidebarItemClick(item.label)}
                    selected={selectedSidebarItem === item.label}
                  >
                    {open ? (
                        <>
                            {item.icon}
                            {item.content}
                        </>
                    ) : (
                        item.icon
                    )}
                  </ListItemButton>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <List component="nav">
              {ManagementItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleSidebarItemClick(item.label)}
                selected={selectedSidebarItem === item.label}
              >
                {open ? (
                  <>
                    {item.icon}
                    {item.content}
                  </>
                ) : (
                  item.icon
                )}
              </ListItemButton>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <List component="nav">
              {SystemItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleSidebarItemClick(item.label)}
                selected={selectedSidebarItem === item.label}
              >
                {open ? (
                  <>
                    {item.icon}
                    {item.content}
                  </>
                ) : (
                  item.icon
                )}
              </ListItemButton>
              ))}
              <ListItemButton
                onClick={() => handleLogout()}
              >
                {open ? (
                  <>
                    <LogOutIcon size='24' />
                    LogOut
                  </>
                ) : (
                  <LogOutIcon size='24' />
                )}
              </ListItemButton>
            </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {selectedContentItem === 'BlogMng' ? (
              <BlogMng
                setSelectedSidebarItem={setSelectedSidebarItem}
                setSelectedContentItem={setSelectedContentItem}
                setSelectedBlog={setSelectedBlog}
              />
            ) : selectedContentItem === 'Dashboard' ? (
              <DashBoard
                setSelectedSidebarItem={setSelectedSidebarItem}
                setSelectedContentItem={setSelectedContentItem}
              /> 
            ) : selectedContentItem === 'NewBlog' ? (
              <NewBlog
                setSelectedSidebarItem={setSelectedSidebarItem}
                setSelectedContentItem={setSelectedContentItem}
                selectedBlog={selectedBlog}
              />
            ) : selectedContentItem === 'SysConfig' ? (
              <SysConfig 
                refreshHomeData={refreshData}
              />
            ):(
              contentMap[selectedContentItem]
            )}
          </Container>
        </Box>
        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmationDialog}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography variant="h5">
              Discard all the current changes made to this blog?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
            <Button onClick={handleConfirmLeaveNewBlog} color="error">Confirm</Button>
          </DialogActions>
        </Dialog>
        {errorMsg && <Dialog open={loginErrorOpen} onClose={handleLoginErrorDialogClose}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <Typography variant="h5">
              {errorMsg}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLoginErrorDialogClose}>Cancel</Button>
            <Button onClick={handleLoginErrorDialogClose}>
              <Link href="/login">
                Confirm
              </Link>
            </Button>
          </DialogActions>
        </Dialog>}
        <Dialog 
          open={dialogOpen} 
          onClose={handleDialogClose} 
          fullWidth
        >
          <DialogTitle color={"white"} sx={{fontSize : "30px", backgroundColor: "#3277d5", height: "5%"}}>Warning</DialogTitle>
          <DialogContent>
            <Typography variant='h5' sx={{margin: '20px'}}>
              You don't have any blogs yet. 
              <br/>
              Let's create one first!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

