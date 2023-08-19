import React, { useEffect, useState } from 'react';
import './EventManagementPage.css';
import Header from '../components/Header';
import { Box, Button, TextField, Typography } from '@mui/material';
import SnackBar from '../components/Snackbar';
import axios from "axios";


const BASE_URL = "http://localhost:8000/api/v1";


const EventForm = ({ addEvent, editEvent, currentEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [error, setError] = useState({
    description: "",
    title: "",
    eventDateTime: ""
  })

  useEffect(() => {
    if (currentEvent) {
      console.log("current event: " + currentEvent)
      setTitle(currentEvent.title);
      setDescription(currentEvent.description);
      setEventDateTime(currentEvent.eventDateTime);
    }
  }, [currentEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = error
    if (!title) {
      err.title = "Title cannot be empty";
    }
    if (!description) {
      err.description = "Description cannot be empty";
    }

    if (!eventDateTime) {
      err.eventDateTime = "EventDateTime cannot be empty";
    }
    setError({ ...err })

    if (title && eventDateTime && description) {
      const newEvent = {
        title,
        description,
        eventDateTime,
      };


      if (currentEvent) {
        newEvent.id = currentEvent.id
        editEvent(newEvent)
      } else {
        addEvent(newEvent);
      }
      setTitle('');
      setDescription('');
      setEventDateTime('');
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid silver" }}>
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>{currentEvent ? "Update Event" : "Create Event"}</h2>
        <TextField
          size="small"
          type="text"
          placeholder="Title"
          value={title ?? currentEvent?.title}
          onChange={(e) => {
            setError({ ...error, title: "" })
            setTitle(e.target.value)
          }}
          sx={{ mt: 1 }}
          error={Boolean(error.title)}
          helperText={error.title}
        />
        <TextField
          size="small"
          placeholder="Description"
          value={description ?? currentEvent?.description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
          sx={{ mt: 1 }}
          error={Boolean(error.description)}
          helperText={error.description}
        />
        <TextField
          size="small"
          type="datetime-local"
          value={eventDateTime ?? currentEvent?.eventDateTime}
          onChange={(e) => setEventDateTime(e.target.value)}
          sx={{ mt: 1 }}
          error={Boolean(error.eventDateTime)}
          helperText={error.eventDateTime}
        />
        <Button variant='contained' sx={{ color: "#fff", bgcolor: "orange", mt: 1 }} type="submit">{currentEvent ? "Update Event" : "Add Event"}</Button>
        <Button variant='outlined' sx={{ color: "orange", mt: 1, border: "1px solid orange" }} type="submit">Cancel</Button>
      </form>
    </Box>

  );
};

const EventList = ({ events, editEvent, deleteEvent }) => {
  let owner = events[0]?.user?.name;
  return (
    <ul className="event-list">
      {events.map((event, index) => {
        if(event?.user?.name){
          owner = event?.user?.name;
        }
        return (<li key={index} className="event-item">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Date and Time: {event.eventDateTime}</p>
          <p>Organiser: {owner}</p>
          <div>
            <Button sx={{ bgcolor: "orange" }} onClick={() => editEvent(event)}>Edit</Button>
            <Button onClick={() => deleteEvent(event)}>Delete</Button>
          </div>
        </li>)
      }

      )}
    </ul>
  );
};


const EventManagementPage = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  useEffect(() => {
    loadEvents();
  }, [])

  const showSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }

  const loadEvents = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/events",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });

      if (response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      showSnackbar("Some error occured while loading event", "error");
    }
  }

  const addEvent = async (newEvent) => {
    try {
      const response = await axios({
        method: "post",
        url: BASE_URL + "/events",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify(newEvent)
      });

      if (response.data) {
        showSnackbar("Event created successfully", "success");
        setCurrentEvent(null);
        setEvents([...events, response.data]);
      }
    } catch (err) {
      showSnackbar("Some error occured while creating event", "error");
    }
  };

  const editEvent = async (event) => {
    try {
      const response = await axios({
        method: "put",
        url: BASE_URL + "/events/" + event.id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify(event)
      });

      if (response.data) {
        showSnackbar("Event updated successfully", "success");
        setCurrentEvent(null);
        const evt = events.map(e => e.id === event.id ? response.data : e)
        setEvents(evt);
      }
    } catch (err) {
      showSnackbar("Some error occured while updating event", "error");
    }
  };

  const deleteEvent = async (event) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/events/" + event.id,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify(event)
      });

      if (response.data) {
        showSnackbar("Event deleted successfully", "success");
        const updatedEvents = events.filter((e, i) => e.id !== event.id);
        setEvents(updatedEvents);
        setCurrentEvent(null);
      }
    } catch (err) {
      showSnackbar("Some error occured while deleting event", "error");
    }
  };

  return (

    <div className="">
      <Header />
      <Box sx={{ display: "flex", mt: 13, p: 3 }}>
        <Box sx={{ flex: 0.5 }}>
          {events.length > 0 && <EventList events={events} editEvent={setCurrentEvent} deleteEvent={deleteEvent} />}
        </Box>
        <Box sx={{ flex: 0.5, ml: 3 }}>
          <EventForm editEvent={editEvent} currentEvent={currentEvent} addEvent={addEvent} />
        </Box>
      </Box>
      <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
    </div>
  );
};

export default EventManagementPage;
