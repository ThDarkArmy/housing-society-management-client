import React, { useState, useEffect } from "react";
import Header from "../components/Header";
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
  Select,
  MenuItem,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "../components/Snackbar";
import { useNavigate } from "react-router-dom";
import BuildingCard from "../components/BuildingCard";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SecretaryPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [building, setBuilding] = useState();
  const [flatId, setFlatId] = useState();
  const [flatType, setFlatType] = useState("");

  const [flatNumber, setFlatNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [rent, setRent] = useState();

  const [showValidationError, setshowValidationError] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [flats, setFlats] = useState([]);

  const [openAnnouncementForm, setOpenAnnouncementForm] = useState(false);

  const [detail, setDetail] = useState("");
  const [title, setTitle] = useState("");
  const [announcementId, setAnnouncementId] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  useEffect(()=> {
    if(!token){
      navigate("/");
  }
    if(role==="ADMIN"){
      navigate("/admin-panel");
    }else if(role==="USER"){
      navigate("/");
    }
},[])

  useEffect(()=> {
      loadMyBuilding();
      loadAnnouncements();
  },[])

  useEffect(() => {
    if (!token) {
      navigate("/login-register");
    }
  }, []);



  const loadAnnouncements = async() => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/announcements/my-announcements",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setAnnouncements(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const deleteFlat = async (flatId) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/flats/" + flatId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.data) {
        showSnackbar("Flat deleted successfully", "success");
        let prd = flats.filter((flat) => flat.id !== flatId);
        setFlats(prd);
        setFlatNumber("");
        setRent("");
        setFloorNumber("");
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error occured while deleting flat", "error");
    }
  };

  const editFlat = async () => {
    if (
      flatNumber === "" ||
      floorNumber === "" ||
      rent === "" ||
      flatType === ""
    ) {
      setshowValidationError(true);
    } else {
      const productData = { flatNumber, floorNumber, rent, flatType };
      try {
        const response = await axios({
          method: "put",
          url: BASE_URL + "/flats/" + flatId,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: JSON.stringify(productData),
        });

        if (response.data) {
          showSnackbar("Flat updated successfully", "success");
          let prd = flats.map((flat) =>
            flat.id === flatId ? response.data : flat
          );
          setFlats(prd);
          setOpenEditForm(false);
          setFlatNumber("");
          setRent("");
          setFloorNumber("");
          setFlatType("");
        }
      } catch (err) {
        console.log(err);
        showSnackbar("Error occured while updating flat", "error");
      }
    }
  };

  const showSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }

  const hideSnackbar = () => {
    setSnackbarMessage("");
    setSnackbarSeverity("");
    setOpenSnackbar(false);
  }

  const addFlat = async () => {
    if (
      flatNumber === "" ||
      flatType === "" ||
      floorNumber === "" ||
      rent === "" 
    ) {
      setshowValidationError(true);
    } else {
      const flatData = { flatNumber, floorNumber, rent, flatType };
      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + "/flats/"+building.id,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: flatData,
        });

        if (response.data) {
          setFlats([...flats, response.data]);
          showSnackbar("Flat added successfully", "success");
          setOpenAddForm(false);
          setFlatNumber("");
          setRent("");
          setFloorNumber("");
          setFlatType("");
        }
      } catch (err) {
        console.log(err);
        showSnackbar("Error occured while adding flat", "error");
      }
    }
  };

  const loadMyBuilding = async () => {
      try {
        const response = await axios({
          method: "get",
          url: BASE_URL + "/buildings/my-building",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          }
        });
        if (response.data) {
          setBuilding(response.data);
          setFlats(response.data.flats);
        }
      } catch (err) {
        console.log(err);
      }
  }

  const handleOpenEditForm = (flat) => {
    setOpenEditForm(true);
    setFlatId(flat.id);
    setFlatNumber(flat.flatNumber);
    setRent(flat.rent);
    setFloorNumber(flat.floorNumber);
    setFlatType(flat.flatType)
  };

  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };


  const addAnnouncement = async () => {
    if (
      title === "" ||
      detail === ""
    ) {
      setshowValidationError(true);
    } else {
      const announcementData = { title, detail };
      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + "/announcements",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: announcementData
        });

        if (response.data) {
          setAnnouncements([...announcements, response.data]);
          showSnackbar("Announcement added successfully", "success");
          setOpenAnnouncementForm(false);
          setDetail("");
          setTitle("");
          setAnnouncementId("")
        }
      } catch (err) {
        console.log(err);
        showSnackbar("Error occured while adding announcements", "error");
      }
    }
  };

  const updateAnnouncement = async () => {
    if (
      title === "" ||
      detail === ""
    ) {
      setshowValidationError(true);
    } else {
      const announcementData = { title, detail };
      try {
        const response = await axios({
          method: "put",
          url: BASE_URL + "/announcements/"+announcementId,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          data: announcementData
        });

        if (response.data) {
          const ann = announcements.map(a=> a.id===response.data.id ? response.data: a);
          setAnnouncements(ann);
          showSnackbar("Announcement updated successfully", "success");
          setOpenAnnouncementForm(false);
          setDetail("");
          setTitle("");
          setAnnouncementId("")
        }
      } catch (err) {
        console.log(err);
        showSnackbar("Error occured while updating announcements", "error");
      }
    }
  };

  const deleteAnnouncement = async (id) => {
      try {
        const response = await axios({
          method: "delete",
          url: BASE_URL + "/announcements/"+id,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          }
        });

        if (response.data) {
          const ann = announcements.filter(a=> a.id!==id);
          setAnnouncements(ann);
          showSnackbar("Announcement deleted successfully", "success");
          setOpenAnnouncementForm(false);
        }
      } catch (err) {
        console.log(err);
        showSnackbar("Error occured while deleting announcements", "error");
      }
  };

  return (
    <div>
      <Header />
      <Box sx={{mt: 9, padding: 1}}>
      <Dialog open={openAnnouncementForm} onClose={() => setOpenAnnouncementForm(false)}>
          <DialogTitle>{announcementId ? "Edit Announcement": "Add Announcement"}</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
             <TextField
              size="small"
              label="Title"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setTitle(e.target.value);
              }}
              value={title}
              sx={{ mt: 2 }}
            />

            <TextField
              size="small"
              label="Detail"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setDetail(e.target.value);
              }}
              multiline
              rows={4}
              value={detail}
              sx={{ mt: 2 }}
            />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setOpenAnnouncementForm(false)
              setAnnouncementId("");
              setDetail("");
              setTitle("");
            }}>Cancel</Button>
            <Button onClick={()=> {
              if(announcementId){
                updateAnnouncement();
              }else{
                addAnnouncement();
              }
            }}>{announcementId? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>
      <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
          <DialogTitle>Edit Flat</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
             <TextField
              size="small"
              label="Flat Number"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setFlatNumber(e.target.value);
              }}
              value={flatNumber}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Floor Number"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setFloorNumber(e.target.value);
              }}
              value={floorNumber}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Rent"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setRent(e.target.value);
              }}
              value={rent}
              sx={{ mt: 2 }}
            />
            <Select
              size="small"
              label="Flat Type"
              fullWidth
              value={flatType}
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setFlatType(e.target.value);
              }}
              sx={{ mt: 2 }}
            >
              <MenuItem value="1RK">1RK</MenuItem>
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="4BHK">4BHK</MenuItem>
              <MenuItem value="5BHK">5BHK</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditForm(false)}>Cancel</Button>
            <Button onClick={editFlat}>Update</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)}>
          <DialogTitle>Add Flat</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
            <TextField
              size="small"
              label="Flat Number"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setFlatNumber(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Floor Number"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setFloorNumber(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Rent"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setRent(e.target.value);
              }}
              value={rent}
              sx={{ mt: 2 }}
            />
            <Select
              size="small"
              label="Flat Type"
              fullWidth
              value={flatType}
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setFlatType(e.target.value);
              }}
              sx={{ mt: 2 }}
            >
              <MenuItem value="1RK">1RK</MenuItem>
              <MenuItem value="1BHK">1BHK</MenuItem>
              <MenuItem value="2BHK">2BHK</MenuItem>
              <MenuItem value="3BHK">3BHK</MenuItem>
              <MenuItem value="4BHK">4BHK</MenuItem>
              <MenuItem value="5BHK">5BHK</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddForm(false)}>Cancel</Button>
            <Button onClick={addFlat}>Add Flat</Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ mt: 5, mb: 1 }}>

            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />

            <Box sx={{ml: 2}}>
             {building ? <BuildingCard building={building}/>: <Typography>Building not assigned yet!</Typography>}
            </Box>
         {building && <Box display="flex" sx={{mt: 5, ml: 2}}>
            <Typography variant="h5" color="initial">
              Flats
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: "auto" }}
              onClick={() => handleOpenAddForm()}
            >
              Add Flat
            </Button>
          </Box>}
         {flats && <Box sx={{ mt: 2, ml: 2 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Flat (Id)</StyledTableCell>
                    <StyledTableCell align="left">Flat Number</StyledTableCell>
                    <StyledTableCell align="left">Floor Number</StyledTableCell>
                    <StyledTableCell align="left">
                      Flat Type
                    </StyledTableCell>
                    <StyledTableCell align="left">Status</StyledTableCell>
                    <StyledTableCell align="left">Rent</StyledTableCell>
                    <StyledTableCell align="left">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flats &&
                    flats.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          component="th"
                          scope="row"
                        >
                          {row.flatNumber}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.floorNumber}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.flatType}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {Boolean(row.status)?"Not Available":"Available"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.rent}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <EditIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditForm(row)}
                          />
                          <DeleteIcon
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteFlat(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>}
        </Box>
    {building &&  <>
      <Box display="flex" sx={{ mt: 10, ml: 2 }}>
          <Typography variant="h5" color="initial">
            Announcements
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: "auto" }}
            onClick={() => setOpenAnnouncementForm(true)}
          >
            Add Announcement
          </Button>
        </Box>
        <Box sx={{mt: 2, ml: 2}}>

              {announcements && announcements.map(announcement =>
              
              <Box sx={{p: 2, border: "1px solid grey", borderRadius: 4, mt: 1, bgcolor: "silver"}}>
                <Box display="flex">
                <Typography>{announcement.title}</Typography>
                <Box sx={{flexGrow: 1}}></Box>
                    <EditIcon
                      sx={{ cursor: "pointer", ml: "auto" }}
                      onClick={() => {
                        setDetail(announcement.detail);
                        setTitle(announcement.title);
                        setAnnouncementId(announcement.id);
                        setOpenAnnouncementForm(true);
                      }}
                    />
                    <DeleteIcon
                      sx={{ cursor: "pointer", ml: 2 }}
                      onClick={() => deleteAnnouncement(announcement.id)}
                    />
                  </Box>
                
                <Divider sx={{height: "0.5px", bgcolor: "grey"}}/>
                <Typography sx={{mt: 2}}>{announcement.detail}</Typography>
              </Box>)}

        </Box>
      </>}
       
      </Box>
    </div>
  )
}

export default SecretaryPanel