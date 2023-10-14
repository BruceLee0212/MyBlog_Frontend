import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const Elevator = ({authorEmail}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate()
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(''); 
  const clearInput = () => {
    setEmail('');
    setContent('');
  }
  const handleContactDialogClose = () => {
    clearInput();
    setReceiverError('');
    setContentError('');
    setSenderError('');
    setContactDialogOpen(false);
  }
  const handleContentChange = (event) => {
    setContent(event.target.value);
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const [message, setMessage] = useState('');
  const [senderError, setSenderError] = useState('');
  const [receiverError, setReceiverError] = useState('');
  const [contentError, setContentError] = useState('');
  const [snackOpen, setSnackOpen] = useState(true);
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  const handleSubmit = async() => {
    const formData = new FormData();
    formData.append("sender", email);
    formData.append("receiver", authorEmail);
    formData.append("content",content);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}send-email`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed'){
          setSenderError(response.data.senderError);
          setReceiverError(response.data.receiverError);
          setContentError(response.data.contentError);
        }
        else{
          setSnackOpen(true);
          setMessage(response.data.message);
          setContactDialogOpen(false);
        }
        clearInput();
      }
    } catch (error) {
      console.error('add error:', error);
    }
  }
  const contactAuthor = () => {
    setContactDialogOpen(true);
  }
  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className={`elevator ${isVisible ? 'visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="elevator-button" onClick={scrollToTop}>
        <Tooltip title={<span>Go To Top</span>}>
          <VerticalAlignTopIcon/>
        </Tooltip>
      </div>
      <div className="elevator-button" onClick={contactAuthor}>
        <Tooltip title={<span>Contact Author</span>}>
          <ForwardToInboxIcon/>
        </Tooltip>
      </div>
      <div className="elevator-button" onClick={redirectToLogin}>
        <Tooltip title={<span>Create Your Blog</span>}>
          <FiberNewIcon/>
        </Tooltip>
      </div>
      <Dialog 
        open={contactDialogOpen} 
        onClose={handleContactDialogClose} 
        fullWidth
      >
        <DialogTitle sx={{fontSize : "30px"}}>Contact Author</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{margin: '20px'}}>
            Enter the content in the text box below, 
            the system will automatically generate the email.
          </DialogContentText>
          {receiverError && <p className="error-message-inline">{receiverError}</p>}
          <TextField
            required
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            label= 'Email'
            value = {email}
            onChange={handleEmailChange} 
          />
          {senderError && <p className="error-message-inline">{senderError}</p>}
          <textarea
            style={{ width: '100%', height: '200px', marginTop: '10px' }}
            value={content}
            onChange={handleContentChange}
          />
          {contentError && <p className="error-message-inline">{contentError}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContactDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      {message && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity='success'>{message}</Alert>
      </Snackbar>}
    </div>
  );
};

export default Elevator;
