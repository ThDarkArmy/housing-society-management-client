import React, { useState } from "react";
import axios from "axios";

import { Grid, TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MenuItem, InputLabel, FormControl, Select, Dialog,
  DialogTitle,
  DialogActions,
  DialogContent , Alert } from "@mui/material";

const BASE_URL = "http://localhost:8000/api/v1";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [openOtp, setOpenOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);

  const handleResetPassword = async () => {
    const data = {
      email: email,
      password: password,
    };

    
    try {
      if (!email) throw "Invalid Data";
    if (!password) throw "Invalid Data";
      const response = await axios({
        method: "put",
        url: BASE_URL + "/users/reset-password",
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setOpenOtp(true);
      } else {
        throw "Error Occured";
      }
    } catch (err) {
      alert("Password reset failed");
    }
  };

  const handleVerifyOtp = async () => {
    setInvalidOtp(false);
    if(otp.length!==4){
      setOtpError("Please provide 4 digit valid otp");
      return;
    }
    try{

      const response = await axios({
        method: "post",
        url: BASE_URL + "/users/verify-otp-password",
        data: JSON.stringify({otp:otp, email:email}), 
        headers: { "Content-Type": "application/json"}
      });

      if(response.data==="Otp verified successfully"){
        console.log(response.data);
        setOtpVerified(true);
        setOpenOtp(false)
        navigate("/login-register");
      }else{
        setInvalidOtp(true);
        console.log(response.data);
      }

    }catch(err){
      console.log("error", err)
    }
  }

  return (
    <div style={{ paddingLeft: "30%", paddingTop: 150 }}>
      <Box noValidate sx={{ mt: 3, width: 400 }}>
        <Typography sx={{ marginBottom: 5 }}>Reset Password</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          onClick={() => handleResetPassword()}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Reset Password
        </Button>
      </Box>

      <Dialog open={openOtp} onClose={() => setOpenOtp(false)}>
          <DialogTitle>Verify Otp</DialogTitle>
          <DialogContent>
          {invalidOtp && <Alert severity="error">Invalid otp, try again</Alert>}
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", padding: 3}}>
                  <TextField 
                  label="otp" 
                  value={otp} 
                  onChange={(e)=> setOtp(e.target.value)}
                  error={Boolean(otpError)}
                  helperText={otpError}
                  />
            </Box>
             
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenOtp(false);
              
            }}>Cancel</Button>
            <Button onClick={()=> {
              handleVerifyOtp();
            }}>Verify</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default ForgetPassword;
