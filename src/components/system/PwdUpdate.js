import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import { useSession } from '../SessionContext';
import { Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';

export default function PwdUpdate() {
  const sessionData = useSession();
  // google captcha setting
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const handleSaveClick = () => {
    handlePwdUpdate();
  };
  const handleCaptchaVerify = () => {
    setIsCaptchaVerified(true);
  };
  // input fields for update password
  const[originalPwd, setOriginalPwd]=useState("");
  const[newPwd, setNewPwd]=useState("");
  const[confirmPwd, setConfirmPwd]=useState("");
  const handleOriginalPwdChange = (event) => {
    setOriginalPwd(event.target.value);
  }
  const handleNewPwdChange = (event) => {
    setNewPwd(event.target.value);
  }
  const handleConfirmPwdChange = (event) => {
    setConfirmPwd(event.target.value);
  }
  // alert message for password update
  const[pwdUpdateMsg, setPwdUpdateMsg]=useState(""); 
  const[originalPwdError, setOriginalPwdError]=useState("");
  const[newPwdError, setNewPwdError]=useState("");
  const[pwdNotMatchError, setPwdNotMatchError]=useState("");
  const[alertColor, setAlertColor]=useState("info");
  // update password func
  const handlePwdUpdate = async (event) => {
    setPwdUpdateMsg("");
    setOriginalPwdError("");
    setNewPwdError("");
    setPwdNotMatchError("");
    if(newPwd !== confirmPwd){
      setPwdNotMatchError("New passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("user", sessionData.user);
    formData.append("originalPassword", originalPwd);
    formData.append("newPassword", newPwd);
    try{
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}profile/password`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if(response.data.hasOwnProperty("status") && response.data.status === "failed"){
          if(response.data.hasOwnProperty("originalPwdError")){
            setOriginalPwdError(response.data.originalPwdError);
          }
          if(response.data.hasOwnProperty("newPwdError")){
            setNewPwdError(response.data.newPwdError);
          }
          setPwdUpdateMsg(response.data.message);
          setAlertColor("error");
        }
        else if(response.data.hasOwnProperty("status") && response.data.status === "succeeded"){
          setPwdUpdateMsg(response.data.message);
          setAlertColor("success");
        }
      }
      setSnackOpen(true);
    } catch (error) {
      console.error('add error:', error);
    }
  }
  const[snackOpen, setSnackOpen] = useState(false); 
  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  return(
    <Box>
      <Card sx={{ width:"40%"}}>
        <CardContent>
          <Typography variant="h5" component="div">
            Password Update
          </Typography>
          <br/>
          <Typography variant="h6">
            Original Password: 
            <input
              type="password"
              className="config-input"
              id="old_pwd"
              onChange={handleOriginalPwdChange}
            />
          </Typography>
          {originalPwdError && <p className="error-message-inline">{originalPwdError}</p>}
          <Typography variant="h6">
            New Password: 
            <input
              type="password"
              className="config-input"
              id="new_pwd1"
              onChange={handleNewPwdChange}
            />
          </Typography>
          {newPwdError && <p className="error-message-inline">{newPwdError}</p>}
          {pwdNotMatchError && <p className="error-message-inline">{pwdNotMatchError}</p>}
          <Typography variant="h6" marginBottom={"20px"}>
            Confirm Password: 
            <input
              type="password"
              className="config-input"
              id="new_pwd2"
              onChange={handleConfirmPwdChange}
            />
          </Typography>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
            hl="en"
            onChange={handleCaptchaVerify}
          />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="large" onClick={handleSaveClick} disabled={!isCaptchaVerified}>
            Save
          </Button>
        </CardActions>
      </Card>
      {pwdUpdateMsg && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity={alertColor}>{pwdUpdateMsg}</Alert>
      </Snackbar>}
    </Box>
  );
}
