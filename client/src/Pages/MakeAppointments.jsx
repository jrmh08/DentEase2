import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import appdentist from '../../pictures/appdentist.jpg';
import dentistself from '../../pictures/dentistself.png';
import '../Styles/MakeAppointments.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import NavBar from '../Component/Nav_Bar';
import Footer from '../Component/Footer';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';



function MakeAppointments() {
  const [appointment, setAppointment] = useState({
    service: '',
    dentist: '',
    patient_name: '',
    phone_number: '',
    email: '',
    date: null,
    time: null,
    note: '',
  });

  const [errors, setErrors] = useState({
    phone_number: false,
    email: false,
    date: false,
    time: false,
  });

  const [isFormValid, setFormValid] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Added state for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [auth2, setAuth2] = useState(null);

  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, []);

  const initClient = () => {
    gapi.client.init({
      apiKey: 'AIzaSyDRUMQya2XJqyeqRSFTPUfDPHSmohAk_8k', 
      clientId: '1047582222950-j7gh1psvto801e8ns851emvvpkna9eup.apps.googleusercontent.com', 
      scope: 'https://www.googleapis.com/auth/calendar',
    }).then(() => {
      setAuth2(gapi.auth2.getAuthInstance());
    });
  };
  
  const handleChange = (field) => (event) => {
    setFormValid(true); // Reset form validation state

    setAppointment({
      ...appointment,
      [field]: event.target.value,
    });
  };
//FOR DATE CHANGES
  const handleDateTimeChange = (value, field) => {
    setAppointment({
      ...appointment,
      [field]: value,
    });
  };

  //FOR NOTIFICATIONS
  const [notifications, setNotifications] = useState(['No New Notifications']);

  const errorMessages = {
    phone_number: 'Phone number must be 11 digits',
    email: 'Invalid email format',
    date: 'No Appointments on Sundays',
    time: 'Time only between 9am to 4pm',
  };

  //FOR APPOINTMENT SUBMISSION WITH CONDITIONS
  const handleSubmit = async () => {
      for (const field in appointment) {
        if (field !== 'note' && !appointment[field]) {
          setSnackbarOpen(true);
          setSnackbarMessage('Please fill in all fields and correct any errors.');
          return;
        }
      }
    
      // Validate phone number length
      if (appointment.phone_number.length !== 11) {
        console.error('Phone number must be 11 digits');
        setFormValid(false);
        setErrors({
          ...errors,
          phone_number: true,
        });
        return;
      }
    
      // Validate email format
      if (!isValidEmail(appointment.email)) {
        console.error('Invalid email format');
        setFormValid(false);
        setErrors({
          ...errors,
          email: true,
        });
        return;
      }
    
      // Validate day is not Sunday
      const selectedDate = appointment.date;
      if (selectedDate && selectedDate.day() === 0) {
        console.error('No booking appointments on Sundays');
        setFormValid(false);
        setErrors({
          ...errors,
          date: true,
        });
        return;
      }
    
      // Validate time is between 9am to 4pm
      const selectedTime = appointment.time;
      const startTime = selectedTime.clone().startOf('day').add(9, 'hours');
      const endTime = selectedTime.clone().startOf('day').add(16, 'hours');
      if (!(selectedTime.isSame(startTime) || (selectedTime.isAfter(startTime) && selectedTime.isBefore(endTime)) || selectedTime.isSame(endTime))) {
        console.error('Appointment time must be between 9am to 4pm');
        setFormValid(false);
        setErrors({
          ...errors,
          time: true,
        });
        return;
      }
  
    // All conditions passed, proceed with form submission
    const formData = {
      service: appointment.service,
      dentist: appointment.dentist,
      patient_name: appointment.patient_name,
      phone_number: appointment.phone_number,
      email: appointment.email,
      date: appointment.date?.format('YYYY-MM-DD'),
      time: appointment.time?.format('HH:mm'),
      note: appointment.note,
    };
  
    try {
      const response = await fetch('http://localhost:3000/addAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(data);
      } else {
        const text = await response.text();
        console.log(text);
      }
  
      // Update notifications state upon successful submission
      setNotifications(['Appointment submitted successfully', ...notifications.filter(notif => notif !== 'No New Notifications')]);
      setFormValid(true);
  
      // Show success message in Snackbar
      setSnackbarOpen(true);
      setSnackbarMessage('Form submitted successfully.');
      createEvent();
  
    } catch (error) {
      console.error('Error submitting appointment:', error);
      // Show error message in Snackbar
      setSnackbarOpen(true);
      setSnackbarMessage('Error submitting appointment. Please try again later.');
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const createEvent = () => {
    if (auth2.isSignedIn.get()) {
      const event = {
        summary: `${appointment.service} appointment with Dr. ${appointment.dentist}`,
        description: appointment.note,
        start: {
          dateTime: `${appointment.date.format('YYYY-MM-DD')}T${appointment.time.format('HH:mm')}:00`,
          timeZone: 'Asia/Manila',
        },
        end: {
          dateTime: `${appointment.date.format('YYYY-MM-DD')}T${appointment.time.add(1, 'hour').format('HH:mm')}:00`,
          timeZone: 'Asia/Manila',
        },
        attendees: [{ email: appointment.email }],
      };

      gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      }).then((response) => {
        console.log('Event created:', response);
        setSnackbarOpen(true);
        setSnackbarMessage('Appointment successfully added to Google Calendar!');
      }).catch((error) => {
        console.error('Error creating event:', error);
        setSnackbarOpen(true);
        setSnackbarMessage('Error creating event. Please try again.');
      });
    } else {
      console.log('User not signed in');
      setSnackbarOpen(true);
      setSnackbarMessage('Please sign in to Google first.');
    }
  };

  return (
    <div className="appointments-page">
      <NavBar notifications={notifications} />
        <div className="top-area">
          <h1 className="appHeader">Make Appointments</h1>
          <img className="img-container" src={appdentist} alt="dentist" />
        </div>
        <div className="appointment-area">
          <div className="form-container">

            <Box sx={{ width: '500px' }}>
              <h4 className="service">Type of Services:</h4>
              <FormControl fullWidth variant="outlined">
                
                <InputLabel>Sevice</InputLabel>
                <Select
                  sx={{ bgcolor: 'white'}}
                  value={appointment.service}
                  label="Service"
                  onChange={handleChange('service')}
                >
                  <MenuItem value={"bridges"}>Dental Bridges</MenuItem>
                  <MenuItem value={"filling"}>Dental Filling</MenuItem>
                  <MenuItem value={"implants"}>Dental Implants</MenuItem>
                  <MenuItem value={"dentures"}>Dentures</MenuItem>
                  <MenuItem value={"inlays & onlays"}>Inlays and Onlays</MenuItem>
                  <MenuItem value={"checkup & clean"}>Check-up & Clean</MenuItem>
                  <MenuItem value={"child therapy"}>Children's Therapy</MenuItem>
                  <MenuItem value={"root canal"}>Root Canal Therapy</MenuItem>
                  <MenuItem value={"emergency dentistry"}>Emergency Dentistry</MenuItem>
                  <MenuItem value={"tmj"}>TMJ Treatment</MenuItem>
                  <MenuItem value={"whitening"}>Teeth Whitening</MenuItem>
                  <MenuItem value={"orthodonic treatment"}>Orthodonic Treatment</MenuItem>
                  <MenuItem value={"veneers"}>Dental Veneers</MenuItem>
                  <MenuItem value={"braces"}>Braces</MenuItem>
                  <MenuItem value={"crowns & veneers"}>Dental Crowns & Veneers</MenuItem>
                </Select>
              </FormControl>

              <h4>Choose Dentist by Name:</h4>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Dentist</InputLabel>
                <Select
                  sx={{ bgcolor: 'white'}}
                  value={appointment.dentist}
                  label="Dentist"
                  onChange={handleChange('dentist')}
                >
                  <MenuItem value={"shawn"}>Shawn Ryan Nacario</MenuItem>
                  <MenuItem value={"aisha"}>Aisha Manalo</MenuItem>
                  <MenuItem value={"gabriel"}>Gabriel Dela Cruz</MenuItem>
                  <MenuItem value={"jeremiah"}>Jeremiah Juinio</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField 
                  sx={{ my: 2, bgcolor: 'white' }} 
                  label="Patient Name" 
                  variant="outlined" 
                  onChange={handleChange('patient_name')} 
                />
              </FormControl>

              <Grid container columnSpacing={{ xs: '10px'}}>
                <Grid item>
                  <TextField
                    sx={{ mb: 1, bgcolor: 'white' }}
                    className="gridtxt"
                    label="Phone"
                    variant="outlined"
                    onChange={handleChange('phone_number')}
                    error={errors.phone_number}
                    helperText={errors.phone_number && errorMessages.phone_number}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    sx={{ mb: 1, bgcolor: 'white' }}
                    className="gridtxt"
                    label="Email"
                    variant="outlined"
                    onChange={handleChange('email')}
                    error={errors.email}
                    helperText={errors.email && errorMessages.email}
                  />
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDatePicker']}>
                      <FormControl
                        sx={{ m: 1, minWidth: 120, bgcolor: 'white' }}
                        error={errors.date}
                      >
                        <MobileDatePicker
                          className="gridpicker"
                          label="Select Date"
                          onChange={(date) => handleDateTimeChange(date, 'date')}
                          value={appointment.date}
                          textField={({ inputRef, ...others }) => (
                            <TextField
                              {...others}
                              InputLabelProps={{ shrink: true }}
                              inputRef={inputRef}
                            />
                          )}
                        />
                        {errors.date && <FormHelperText>No Appointments on Sundays</FormHelperText>}
                      </FormControl>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileTimePicker']}>
                      <FormControl
                        sx={{ m: 1, minWidth: 120, bgcolor: 'white' }}
                        error={errors.time}
                      >
                        <MobileTimePicker
                          label="Select Time"
                          onChange={(time) => handleDateTimeChange(time, 'time')}
                          value={appointment.time}
                          textField={({ inputRef, ...others }) => (
                            <TextField
                              {...others}
                              InputLabelProps={{ shrink: true }}
                              inputRef={inputRef}
                            />
                          )}
                        />
                        {errors.time && <FormHelperText>Time only between 9am to 4pm</FormHelperText>}
                      </FormControl>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <TextField sx={{ my: 2, bgcolor: 'white' }} label="Note" multiline rows={5} variant="outlined" onChange={handleChange('note')} />
              </FormControl>

              <Button variant="contained" onClick={handleSubmit}>Submit</Button>

            </Box>
          
          </div>
          <div >
            <img className="img-div" src={dentistself} alt="dentistself" />
          </div>
        </div>
        <Footer />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={handleCloseSnackbar}
          message={isFormValid ? snackbarMessage : 'Please fill in all fields and correct any errors.'}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
              sx={{
                position: 'absolute',
                right: 1,
                top: 8,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
    </div>
  );
}

export default MakeAppointments;