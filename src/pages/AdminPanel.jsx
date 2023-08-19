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

const AdminPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [buildings, setBuildings] = useState();

  const [showValidationError, setshowValidationError] = useState(false);

  const [openBuildingForm, setOpenBuildingForm] = useState(false);
  const [openSecretaryForm, setOpenSecretaryForm] = useState(false);

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [ numberOfFlats, setNumberOfFlats] = useState("");
  const [ image, setImage] = useState(null);
  const [ secretaryId, setSecretaryId] = useState("");

  const [users, setusers] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  useEffect(()=> {
    if(!token){
      navigate("/login-register");
  }
    if(role==="SELLER"){
      navigate("/seller-panel");
    }else if(role==="USER"){
      navigate("/");
    }
},[])


const showSnackbar = (msg, severity) => {
  setSnackbarMessage(msg);
  setSnackbarSeverity(severity);
  setOpenSnackbar(true);
}

  const deleteBuilding = async (buildingId) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/buildings/" + buildingId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.data) {
        showSnackbar("Building deleted successfully", "success")
        let prd = buildings.filter((building) => building.id !== buildingId);
        setBuildings(prd);
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error occured while deleting building", "error")
    }
  };


  const loadBuildings = async () => {
      try {
        const response = await axios({
          method: "get",
          url: BASE_URL + "/buildings",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          }
        });
        if (response.data) {
          setBuildings(response.data)
        }
      } catch (err) {
        console.log(err);
      }
  };

  const loadUsers = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/users/all",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setusers(response.data)
      }
    } catch (err) {
      console.log(err);
    }
};

const deleteUser = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: BASE_URL + "/users/"+id,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      }
    });
    if (response.data) {
      showSnackbar("User deleted successfully", "success")
    }
  } catch (err) {
    console.log(err);
    showSnackbar("Error occured while deleteing users", "error")
  }
};

const addBuilding = async () => {
  if (
    name === "" ||
    address === "" ||
    numberOfFlats==="" ||
    image === null
  ) {
    setshowValidationError(true);
  } else {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("numberOfFlats", numberOfFlats);
    formData.append("image", image);
    try {
      const response = await axios({
        method: "post",
        url: BASE_URL + "/buildings",
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        data: formData
      });

      if (response.data) {
        setBuildings([...buildings, response.data]);
        showSnackbar("Building added successfully", "success");
        setOpenBuildingForm(false);
        setAddress("");
        setName("");
        setBuildingId("")
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error occured while adding buildings", "error");
    }
  }
};

const updateBuilding = async () => {
  if (
    name === "" ||
    address === "" ||
    numberOfFlats===""
  ) {
    setshowValidationError(true);
  } else {
    const buildingData = { name, address, numberOfFlats };
    try {
      const response = await axios({
        method: "put",
        url: BASE_URL + "/buildings/"+buildingId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: buildingData
      });

      if (response.data) {
        const ann = buildings.map(a=> a.id===response.data.id ? response.data: a);
        setBuildings(ann);
        showSnackbar("Building updated successfully", "success");
        setOpenBuildingForm(false);
        setAddress("");
        setName("");
        setBuildingId("")
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error occured while updating buildings", "error");
    }
  }
};


const assignSecretary = async () => {
  if(!secretaryId){
    setshowValidationError(true);
    return;
  }
    try {
      const response = await axios({
        method: "post",
        url: BASE_URL + "/buildings/"+buildingId+"/assign-secretary/"+secretaryId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {}
      });

      if (response.data) {
        const ann = buildings.map(a=> a.id===response.data.id ? response.data: a);
        setBuildings(ann);
        showSnackbar("Secretary assigned successfully", "success");
        setOpenSecretaryForm(false);
        setSecretaryId("")
        setBuildingId("")
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error occured while assigning secretary", "error");
    }
};


  useEffect(() => {
   loadBuildings();
   loadUsers();
  }, []);


  return (
    <div>
      <Header />
      <Box sx={{mt: 9, padding: 1}}>

        <Box sx={{ mt: 5, mb: 1 }}>
      
            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
            <Box display="flex">
            <Typography variant="h5" color="initial">
             Buildings
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: "auto" }}
              onClick={() => setOpenBuildingForm(true)}
            >
              Add Building
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Building (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Address</StyledTableCell>
                    <StyledTableCell align="right">
                      Number of Flats
                    </StyledTableCell>
                    <StyledTableCell align="right">Secretary</StyledTableCell>
                    <StyledTableCell align="right">Image</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buildings &&
                    buildings.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.address}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.numberOfFlats}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.user ? row?.user?.name : <Button onClick={()=> {
                            setBuildingId(row.id);
                            setOpenSecretaryForm(true);
                          }}>Assign Secretary</Button> }
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <img height="30" width="30" src={row.imageUrl}/>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <EditIcon
                            sx={{ cursor: "pointer", ml: "auto" }}
                            onClick={() => {
                              setAddress(row.address);
                              setName(row.name);
                              setBuildingId(row.id);
                              setNumberOfFlats(row.numberOfFlats);
                              setOpenBuildingForm(true);
                            }}
                          />
                          <DeleteIcon
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteBuilding(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" sx={{mt: 5}}>
            <Typography variant="h5" color="initial">
              Users
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX:"auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>User (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Contact No.</StyledTableCell>
                    <StyledTableCell align="right">
                      Email
                    </StyledTableCell>
                    <StyledTableCell align="right">Address</StyledTableCell>
                    <StyledTableCell align="right">Role</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users &&
                    users.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.address}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.role}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteUser(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>

      <Dialog open={openBuildingForm} onClose={() => setOpenBuildingForm(false)}>
          <DialogTitle>{buildingId ? "Edit Building": "Add Building"}</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
             <TextField
              size="small"
              label="Name"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setName(e.target.value);
              }}
              value={name}
              sx={{ mt: 2 }}
            />

            <TextField
              size="small"
              label="Address"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setAddress(e.target.value);
              }}
              value={address}
              sx={{ mt: 2 }}
            />
             <TextField
              size="small"
              label="Number of Flats"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setNumberOfFlats(e.target.value);
              }}
              value={numberOfFlats}
              sx={{ mt: 2 }}
            />
         {!buildingId && <TextField
            size="small"
            label="Detail"
            fullWidth
            onChange={(e) => {
              setshowValidationError(false);
              setImage(e.target.files[0]);
            }}
            type="file"
            sx={{ mt: 2 }}
          />}
            
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setOpenBuildingForm(false)
              setBuildingId("");
              setAddress("");
              setName("");
            }}>Cancel</Button>
            <Button onClick={()=> {
              if(buildingId){
                updateBuilding();
              }else{
                addBuilding();
              }
            }}>{buildingId? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSecretaryForm} onClose={() => setOpenSecretaryForm(false)}>
          <DialogTitle>Assign Secretary</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">Please choose some secretary</Alert>
            )}

          <Select
            size="small"
            label="Select Secretary"
            placeholder="Select Secretary"
            fullWidth
            type="text"
            onChange={(e) => {
              setshowValidationError(false);
              setSecretaryId(e.target.value);
            }}
            sx={{ mt: 2 }}
          >
            {users.filter(user=> user.role==="SECRETARY" && !user.building).map(user=> <MenuItem value={user.id}>{user.name}</MenuItem>)}
            {users.filter(user=> user.role==="SECRETARY" && !user.building).length===0 && <MenuItem>No Secretary Available</MenuItem>}
          </Select>
             
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setOpenSecretaryForm(false)
               setSecretaryId("")
               setBuildingId("")
            }}>Cancel</Button>
            <Button onClick={()=> {
              assignSecretary();
            }}>{buildingId? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>
    </div>
  )
}

export default AdminPanel;