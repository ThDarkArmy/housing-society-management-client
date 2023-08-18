import React, { useState } from "react";
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
  Card
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "./Snackbar";

import { useNavigate } from "react-router-dom";
import SnackBar from "./Snackbar";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const FlatCard = ({ flat, building }) => {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openBookSlotForm, setOpenBookSlotForm] = useState(false);
  const [showValidationError, setshowValidationError] = useState(false);
  const [flatId, setFlatId] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [paymentDialog, setPaymentDialog] = useState(false);


  const bookFlat = async () => {
      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + "/flats/book-flat/"+flatId,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: JSON.stringify({})
        });

        console.log("response"+ response);

        if (response.data) {
          setOpenSnackbar(true);
          setSnackbarMessage("Flat booked successfully");
          setSnackbarSeverity("success")
          setFlatId("");
          setPaymentDialog(false);
        }
      } catch (err) {
        setOpenSnackbar(true);
        setSnackbarMessage("Some error occured while booking flat");
        setSnackbarSeverity("error")
      }
  };


  const handleOpenBookSlotForm = () => {
    if (!token) {
      navigate("/login-register");
    } else {
      if (flat.user) {
        setOpenSnackbar(true);
        setSnackbarMessage("Flat is already booked");
        setSnackbarSeverity("warning")
      } else {
        setFlatId(flat.id);
        setOpenBookSlotForm(true);
      }
    }

  }

  return (
    <div>
      <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
      <Card onClick={() => handleOpenBookSlotForm()} sx={{ cursor: "pointer", bgcolor: "burlywood", width: 250, padding: 1 }}>
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
          <Button disabled={Boolean(flat.status)} sx={{color: "red"}} onClick={()=> setPaymentDialog(true)}>Book Flat</Button>
        </Box>
      </Card>

      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <Box sx={{padding: 2}}>
            <Typography  sx={{mt: 1}}>Building Name: {building.name}</Typography>
              <Typography sx={{mt: 1}}>Flat Number: {flat.flatNumber}</Typography>
              <Typography  sx={{mt: 1}}> Floor Number: {flat.floorNumber}</Typography>
              <Typography  sx={{mt: 1}}> Flat Type: {flat.flatType}</Typography>
              <Typography  sx={{mt: 1}}> Address: {building.address}</Typography>
              <Typography  sx={{mt: 1}}>Total Price: {flat.rent}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={() => bookFlat()}>Make Payment</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default FlatCard