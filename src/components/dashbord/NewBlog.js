import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSession } from '../SessionContext'
import axios from 'axios';
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Chip from '@mui/material/Chip';

export default function NewBlog({selectedBlog, setSelectedSidebarItem, setSelectedContentItem }){
  // get session data from sessionContext
  const sessionData = useSession();
  // input fields required for a new blog
  const [blogCategory, setBlogCategory] = useState(selectedBlog && selectedBlog.blogCategory ? selectedBlog.blogCategory : '');
  const [commentAllowed, setCommentAllowed] = useState(selectedBlog && selectedBlog.enableComment ? selectedBlog.enableComment : '');
  const [blogStatus, setBlogStatus] = useState(selectedBlog && selectedBlog.blogStatus ? selectedBlog.blogStatus : '');
  const [blogTitle, setBlogTitle] = useState(selectedBlog && selectedBlog.blogTitle ? selectedBlog.blogTitle : '');
  const [blogUrl, setBlogUrl] = useState(selectedBlog && selectedBlog.blogSubUrl ? selectedBlog.blogSubUrl : '');
  const [blogTags, setBlogTags] = useState(selectedBlog && selectedBlog.blogTags ? selectedBlog.blogTags.split(",") : []);
  const [blogCover, setBlogCover] = useState();
  // 0-4 default cover with index, 5 from selected blog(for update), 6 upload cover 
  const [blogCoverSource, setBlogCoverSource] = useState(-1);
  // initialize blog with default content
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [defaultCovers, setDefaultCovers] = useState([]);
  const [value, setValue] = useState(selectedBlog && selectedBlog.blogContent ? selectedBlog.blogContent : "**yours to create**");
  document.documentElement.setAttribute('data-color-mode', 'light');
  // get tags and catgories information
  const refreshData = async () => {
    try {
      const params = {
        blogOwner: sessionData.user,
      };
      if (selectedBlog && selectedBlog.blogCoverImage) {
        params.originalBlogCover = selectedBlog.blogCoverImage;
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}new-blog`, {
        params: params
      });
      if (response.status === 200) {
        setTags(response.data.blogTagList);
        setCategories(response.data.blogCategoryList);
        setDefaultCovers(response.data.defaultCovers);
        setBlogCover(response.data.originalBlogCover);
        setBlogCoverSource(response.data.blogCoverSource);
        setSelectedImage(response.data.originalBlogCover);
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
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleCategoryChange = (event, newValue) => {
    setBlogCategory(newValue);
  };
  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value);
  };
  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value);
  };
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleCommentChange = (option) => {
    setCommentAllowed(option);
  };
  const handleStatusChange = (option) =>{
    setBlogStatus(option);
  }
  // tags input module
  const tagPool = tags.map(tag => tag.tagName);
  const [inputTag, setInputTag] = useState('');
  const handleInputTagChange = (event, newInputValue) => {
    setInputTag(newInputValue);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputTag.trim() !== '') {
      if (!blogTags.includes(inputTag)) {
        setBlogTags([...blogTags, inputTag]);
      }
      setInputTag('');
    }
  };
  const handleTagDelete = (tagToDelete) => {
    setBlogTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };
  const [selectedImage, setSelectedImage] = useState(null);
  // select a random cover
  const handleRandomImage = () => {
    if (defaultCovers && defaultCovers.length > 0) {
      const randomIndex = Math.floor(Math.random() * defaultCovers.length);
      const randomImagePath = defaultCovers[randomIndex];
      setSelectedImage(randomImagePath);
      setBlogCoverSource(randomIndex)
    }
  }; 
  // upload image from device
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
      setBlogCover(file);
      setBlogCoverSource(6);
    }
  };
  const [aMsg, setAMsg] = useState("");
  const [aErrorMsg, setAErrorMsg] = useState([]);
  const [snackOpen, setSnackOpen] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [status, setStatus] = useState("failed");
  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  }
  const handleSnackClose = () => {
    setSnackOpen(false);
    if(status === 'succeeded'){
      setSelectedSidebarItem('BlogMng');
      setSelectedContentItem('BlogMng');
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("blogOwner", sessionData.user);
    if(selectedBlog) formData.append("blogId", selectedBlog.blogId);
    formData.append("blogTitle", blogTitle);
    formData.append("blogTags", blogTags);
    formData.append("blogUrl", blogUrl);
    formData.append("blogCategoryId", blogCategory.categoryId);
    formData.append("blogCategoryName", blogCategory.categoryName);
    formData.append("blogContent", value);
    formData.append("blogCover", blogCover);
    if(blogCover === undefined){
      formData.append("blogCoverSource", -1);
    }
    else{
      formData.append("blogCoverSource", blogCoverSource);
    }
    formData.append("blogStatus", blogStatus);
    formData.append("enableComment", commentAllowed);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}blogs/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setStatus("failed")
          setAMsg("Blog save failed");
          setSnackOpen(true);
          setErrorDialogOpen(true);
          if(response.data.hasOwnProperty('errorList')) {
            setAErrorMsg(response.data.errorList);
          }
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setStatus('succeeded');
          setAMsg('Blog has been saved');
          setSnackOpen(true);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    handleDialogClose();
  };
  // return button function
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleReturnButtonClick = () =>{
    setConfirmDialogOpen(true);
  }
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  }
  const handleDiscardChanges = () => {
    setSelectedSidebarItem('BlogMng');
    setSelectedContentItem('BlogMng');
  }

  
  return (
    <Box>
      <Typography variant="h6" component="div">
          Create New Blog
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            size="small"
            id="blog_title"
            name="blog_title" 
            value={blogTitle}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            size='small'
            id="tag-input"
            options={tagPool}
            freeSolo
            value={blogTags}
            onChange={(event, newValue) => {
              setBlogTags(newValue);
            }}
            onInputChange={handleInputTagChange}
            inputValue={inputTag}
            getOptionLabel={(option) => option}
            filterOptions={(options, state) => {
              const inputValue = state.inputValue.toLowerCase();
              return options.filter((option) =>
                option.toLowerCase().includes(inputValue)
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add tags" 
                onKeyDown={handleKeyDown}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="SubUrl"
            variant="outlined"
            fullWidth
            size="small" 
            id="blog_url"
            value={blogUrl}
            onChange={handleUrlChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            disablePortal
            id="category_options"
            options={categories}
            onChange={handleCategoryChange}
            getOptionLabel={(option) => option.categoryName}
            isOptionEqualToValue={(option, value) => option.categoryId === value?.categoryId}
            renderInput={(params) => <TextField {...params} label="Category" size='small'/>}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <div className="container">
        <MDEditor
          value={value}
          onChange={setValue}
          height={"500px"}
        />
      </div>
      <Grid container spacing={2} justifyContent="flex-end" marginTop={'5px'}>
        <Grid item>
          <Button variant="contained" color='grey' onClick={handleReturnButtonClick}>Return</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleDialogOpen}>Save</Button>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Complete Information</DialogTitle>
          <DialogContent>
            <div>
              {selectedImage ? (
                <img
                  alt="Preview"
                  style={{ width: '160x', height: '120px' }}
                  src={`data:image/*;base64,${selectedImage}`}
                />
              ) : (
                <CameraIcon fontSize="large" style={{ width: '150px', height: '150px' }} />
              )}
              <br />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleRandomImage} size="small">
                  Random
                </Button>
                <div style={{ width: '20px' }} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: 'none' }}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <Button component="span" variant="contained" size="small">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
              <div style={{ display: 'flex', alignItems: 'center'}}>
                <p style={{ marginRight: '10px' }}>Blog Status:</p>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <input
                    type="radio"
                    value="Published"
                    checked={blogStatus === 1}
                    onChange={() => handleStatusChange(1)}
                  />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    value="Draft"
                    checked={blogStatus === 0}
                    onChange={() => handleStatusChange(0)}
                  />
                  Draft
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0'}}>
                <p style={{ marginRight: '10px' }}>Comment allowed:</p>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <input
                    type="radio"
                    value="Yes"
                    checked={commentAllowed === 1}
                    onChange={() => handleCommentChange(1)}
                  />
                  Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    value="No"
                    checked={commentAllowed === 0}
                    onChange={() => handleCommentChange(0)}
                  />
                  No
                </label>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography variant="h5">
              Discard all the current changes made to this blog?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDiscardChanges} color="error">Confirm</Button>
            <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {aErrorMsg && <Dialog
          width={"100px"} 
          open={errorDialogOpen} 
          onClose={handleErrorDialogClose}
        >
          <DialogTitle color={"white"} sx={{fontSize : "20px", backgroundColor: "#3277d5", height: "5%"}}>Blog save failed</DialogTitle>
          <DialogContent>
            <ul style={{ margin: '10px', paddingLeft: '0' }}>
              {aErrorMsg.map((error, index) => (
                <li key={index}> {error}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorDialogClose}>Confirm</Button>
          </DialogActions>        
        </Dialog>}
      {aMsg && <Dialog
        width={"100px"} 
        open={snackOpen} 
        onClose={handleSnackClose}
      >
        <DialogTitle color={"white"} sx={{fontSize : "20px", backgroundColor: "#3277d5", height: "5%", marginBottom: "20px"}}>Result</DialogTitle>
        <DialogContent><span style={{ marginTop: '30px', paddingLeft: '0' }}>{aMsg}</span></DialogContent>
        <DialogActions>
        <Button onClick={handleSnackClose}>Confirm</Button>
        </DialogActions>
      </Dialog>}
    </Box>
  );
}