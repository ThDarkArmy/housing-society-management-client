import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "../components/Snackbar";
import FlatCard from "../components/FlatCard";

const BASE_URL = "http://localhost:8000/api/v1";

const BuildingPage = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [flats, setFlats] = useState([]);
    const [building, setBuilding] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const loadBuilding = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/buildings/by-id/${id}`);
          if (response.data) {
            setBuilding(response.data);
            setFlats(response.data.flats);
          }
        } catch (error) {
          console.log(error);
        }
      }
    
      useEffect(()=> {
        loadBuilding();
      },[])

  return (
    <div>
        <Header/>
        <Box sx={{mt: 8}}>
            <Box sx={{padding: 2, display:"flex", justifyContent: "center", alignItems:"center"}}>
                <Typography sx={{fontSize: 25}}>Book a Flat</Typography>
            </Box>
            <Box sx={{mt: 5, padding: 2}}>
                <Grid container spacing={10}>
                    {flats && flats.map((flat, index)=> <Grid item key={index} xs={12} ms={4} md={3} lg={3}>
                    <FlatCard flat = {flat} building = {building}/>
                    </Grid>)}
                </Grid>
            </Box>
        </Box>
    </div>
  )
}

export default BuildingPage