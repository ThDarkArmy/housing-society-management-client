import React, { useState, useRef } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Card,
  Grid,
  Container,
  CssBaseline
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "./Snackbar";

import { useNavigate } from "react-router-dom";
import SnackBar from "./Snackbar";
import { useReactToPrint } from 'react-to-print';

import Receipt from "./Receipt";
const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const FlatCard = ({ flat, building }) => {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const [showValidationError, setshowValidationError] = useState(false);
  const [flatId, setFlatId] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [openVisitorForm, setOpenVisitorForm] = useState(false);

  const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [addressError, setaddressError] = useState(false)
    const [address, setaddress] = useState()
    const [contactNumberError, setContactNumberError] = useState(false)
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [contactNumber, setContactNumber] = useState();

    const [openReceipt, setOpenReceipt] = useState(false);



    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const showSnackbar = (msg, severity) => {
      setSnackbarMessage(msg);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let er = false;

        const data = {
            flatId: flat.id,
            email: formData.get("email"),
            contactNumber: formData.get("contactNumber"),
            address: formData.get("address"),
            name: formData.get("firstName") + " " + formData.get("lastName"),
        }

        const { email, contactNumber, password } = data
        if (email === "" || !validateEmail(email)) {
            er = true;
            setEmailError(true)
        } else {
            setEmailError(false)
        }
        if (formData.get("firstName") === "") {
            er = true;

            setFirstNameError(true)
        } else {
            setFirstNameError(false)
        }

        if (formData.get("lastName") === "") {
            er = true;
            setLastNameError(true)
        } else {
            setLastNameError(false)
        }

        if (formData.get("address") === "") {
            er = true;
            setaddressError(true)
        } else {
            setaddressError(false)
        }

        if (contactNumber === "" || contactNumber.length != 10) {
            er = true;

            setContactNumberError(true)
        } else {
            setContactNumberError(false)
        }
        try {
            if (er) throw "Invalid form data"
            const response = await axios({
                method: "post",
                url: BASE_URL + "/visitors",
                data: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (response.data) {
              setOpenVisitorForm(false);
              showSnackbar("Vistors form submitted successfully", "success")
                setFirstName("");
                setLastName("");
                setEmail("");
                setContactNumber("");
                setaddress("");

            }
        } catch (err) {
            setError(true)
            showSnackbar("Some error occured while submitting form", "error")
            setTimeout(() => setError(false), 5000)
        }
    };

    const componentRef = useRef();
    const printReceipt = useReactToPrint({
      content: () => componentRef.current,
    });
  



  const bookFlat = async () => {
    try {
      const response = await axios({
        method: "post",
        url: BASE_URL + "/flats/book-flat/" + flat.id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify({})
      });

      if (response.data) {
        setOpenReceipt(true)
        showSnackbar("Flat booked successfully", "success");
        setFlatId("");
        setPaymentDialog(false);
       
      }
    } catch (err) {
      showSnackbar("Some error occured while booking flat", "error");
    }
  };

  return (
    <div>
      <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
      <Card sx={{ cursor: "pointer", bgcolor: "burlywood", width: 250, padding: 1 }}>
        <Box sx={{ bgcolor: "#fff", padding: 1 }}>
          <Typography>{`Flat Number: ${flat.flatNumber}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Flat Type: ${flat.flatType}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Floor Number: ${flat.floorNumber}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Address: ${building.address}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`Rent: ${flat.rent}/month`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1 }}>
          <Typography>{`${Boolean(flat.status) ? "Not Available" : "Available"}`}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#fff", padding: 1, mt: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button disabled={!flat.user} sx={{ color: "green" }} onClick={() => setOpenVisitorForm(true)}>Visit</Button>
          <Button disabled={Boolean(flat.status)} sx={{ color: "red", ml: 7 }} onClick={() => {
            if (!token) {
              navigate("/login-register")
            } else {
              setPaymentDialog(true)
            }
          }}
          >Book Flat</Button>
        </Box>
      </Card>

      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ padding: 2 }}>
            <Typography sx={{ mt: 1 }}>Building Name: {building.name}</Typography>
            <Typography sx={{ mt: 1 }}>Flat Number: {flat.flatNumber}</Typography>
            <Typography sx={{ mt: 1 }}> Floor Number: {flat.floorNumber}</Typography>
            <Typography sx={{ mt: 1 }}> Flat Type: {flat.flatType}</Typography>
            <Typography sx={{ mt: 1 }}> Address: {building.address}</Typography>
            <Typography sx={{ mt: 1 }}>Total Price: {flat.rent}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={() => bookFlat()}>Make Payment</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openVisitorForm} onClose={() => setOpenVisitorForm(false)}>
        <DialogTitle>Fill Vistor Form</DialogTitle>
        <form onSubmit={handleSubmit}>
        <DialogContent>
          {showValidationError && (
            <Alert severity="error">All the fields are mandatory</Alert>
          )}
            <Container sx={{ marginTop: 0, bgcolor: "#fff", padding: 1 }} component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {error && <Alert severity="error">Error occured, while editing profile</Alert>}
                {success && <Alert severity="success">Profile updated successfully</Alert>}

                <Box
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={firstName}
                        error={firstNameError}
                        helperText={firstNameError ? "Enter first name" : ""}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                          setFirstNameError(false)
                        }}
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label={firstName ? "" : "First Name"}

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={lastName}
                        error={lastNameError}
                        helperText={lastNameError ? "Enter last name" : ""}
                        onChange={(e) => {
                          setLastName(e.target.value)
                          setLastNameError(false)
                        }}
                        required
                        fullWidth
                        id="lastName"
                        label={lastName ? "" : "Last Name"}
                        name="lastName"

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={email}
                        error={emailError}
                        helperText={emailError ? "Enter valid email" : ""}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailError(false)
                        }}
                        required
                        fullWidth
                        id="email"
                        label={email ? "" : "Email"}
                        name="email"
                        autoComplete="email"

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={contactNumber}
                        error={contactNumberError}
                        helperText={contactNumberError ? "Enter valid contact number" : ""}
                        onChange={(e) => {
                          setContactNumber(e.target.value)
                          setContactNumberError(false)
                        }}
                        required
                        fullWidth
                        id="contactNumber"
                        label={contactNumber ? "" : "Contact Number"}
                        name="contactNumber"
                        autoComplete="contactNumber"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        error={addressError}
                        value={address}
                        helperText={addressError ? "Enter valid address" : ""}
                        onChange={(e) => {
                          setaddress(e.target.value)
                          setaddressError(false)
                        }}
                        required
                        fullWidth
                        id="address"
                        label={address ? "" : "Address"}
                        name="address"
                        autoComplete="address"
                        type="text"
                      />
                    </Grid>

                  </Grid>

                </Box>
              </Box>
            </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVisitorForm(false)}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
        </form>
       
      </Dialog>

      <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)}>
      <DialogContent>
          <Box sx={{ padding: 2 }}>
           <Receipt ref={componentRef} owner={loggedInUser} building={building} flat={flat}/>
          </Box>
        </DialogContent>
      <DialogActions>
          <Button onClick={() => setOpenReceipt(false)}>Cancel</Button>
          <Button onClick={()=> {
            
            printReceipt()
            setOpenReceipt(false);
            }}>Print Receipt</Button>
        </DialogActions>
      </Dialog>
      <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />

    </div>
  )
}

export default FlatCard