import React, {useState, useEffect } from 'react'
import Header from '../components/Header';
import axios from "axios";
import { Box, Typography, Divider } from '@mui/material';


const BASE_URL = "http://localhost:8000/api/v1";

const Announcements = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [announcements, setAnnouncements] = useState([]);

    const loadAnnouncements = async() => {
        try {
          const response = await axios({
            method: "get",
            url: BASE_URL + "/announcements",
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

      useEffect(()=> {
        loadAnnouncements();
    },[])
    

  return (
    <div>
        <Header/>

        <Box sx={{mt: 15, p: 3}}>

            <Typography variant='h4'>Announcements</Typography>

              {announcements && announcements.map(announcement =>
              
              <Box sx={{p: 2, border: "1px solid grey", borderRadius: 4, mt: 2, bgcolor: "silver"}}>
                <Typography>{announcement.title}</Typography>
                <Divider sx={{height: "0.5px", bgcolor: "grey"}}/>
                <Typography sx={{mt: 2}}>{announcement.detail}</Typography>
              </Box>)}

        </Box>
    </div>
  )
}

export default Announcements