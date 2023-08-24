import React from "react";

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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class Receipt extends React.PureComponent {
    constructor(props){
        super(props)
        
    }
   
  

  render(){
    return <Box sx={{display: "flex", flexDirection: "column", m: 2, p:2, border: "1px solid black"}}>
      <Box display="flex" sx={{mt: 1}}>
      <Typography>RENT RECEIPT {" "+monthNames[new Date().getMonth()]+"-"+new Date().getFullYear()} </Typography>  <Box sx={{ml:"144px"}}></Box> <Typography>Receipt No: 1</Typography>
      </Box>
  
      <Box display="flex" sx={{mt: 1}}>
      <Typography> Generated on Housing Society Portal</Typography> <Box sx={{flexGrow: 1, ml: "80px"}}></Box> <Typography>Date:  {new Date().getDate()
      +" "+monthNames[new Date().getMonth()]+", "+new Date().getFullYear()}</Typography> 
      </Box>
  
  <Box sx={{mt: 3}}>
  <p>Received sum of INR Rs.{this.props.flat.rent} from {this.props.owner} towards the rent of flat no-{this.props.flat.flatNumber} located in {" "+this.props.building.name+", "+this.props.building.address+" "} for the month {monthNames[new Date().getMonth()]+"-"+new Date().getFullYear()}.</p>
  </Box>
  
  <Box sx={{mt: 2}}>
  <p>Owner {this.props.building.user.name}</p>
  </Box>
  
    </Box>
  }

  }

  export default Receipt;