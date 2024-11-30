import React, { useState, useEffect } from 'react';
import '../Styles/AdminPage.css';
import NavBar from '../Component/Nav_Bar';
import Footer from '../Component/Footer';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const DentistPage = () => {
  const [notifications, setNotifications] = useState(['No New Notifications']);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch all appointments from the server
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/getAllAppointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditedStatus(appointment.status);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    console.log(selectedAppointment.appointment_id);
    await handleEditFormSubmit();
    await updateAppStatus(selectedAppointment.appointment_id, editedStatus);
  };

  const handleEditFormSubmit = () => {
    // Update the selected appointment in the state
    const updatedAppointments = appointments.map((appointment) =>
      appointment === selectedAppointment
        ? { ...selectedAppointment, status: editedStatus }
        : appointment
    );
    setAppointments(updatedAppointments);
    setSelectedAppointment(null);

    // Update the appointment on the server
    updateAppointment(selectedAppointment);
  };

  const updateAppointment = async (editedData) => {
    try {
      const response = await fetch('http://localhost:3000/updateAppointment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
   
      if (response.ok) {
        console.log('Appointment updated successfully');
      } else {
        console.error('Error updating appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const updateAppStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/updateAppStatus/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const newNotification = `Appointment ID: ${appointmentId} changed status to ${status}`;
        setNotifications([newNotification, ...notifications.filter(notif => notif !== 'No New Notifications')]);
        console.log('Appointment status updated successfully');
      } else {
        console.error('Error updating appointment status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
   

  return (
    <div className="admin-container">
      <NavBar notifications={notifications} />
      <div className="appointment-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Dentist</th>
              <th>Patient's Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Note</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointment_id}>
                <td>{appointment.appointment_id}</td>
                <td>{appointment.service}</td>
                <td>{appointment.dentist}</td>
                <td>{appointment.patient_name}</td>
                <td>{appointment.phone_number}</td>
                <td>{appointment.email}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.note}</td>
                <td>
                  {isEditing && selectedAppointment === appointment ? (
                    <Select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                    >
                      <MenuItem value="APPROVED">APPROVED</MenuItem>
                      <MenuItem value="DECLINED">DECLINED</MenuItem>
                    </Select>
                  ) : (
                    appointment.status
                  )}
                </td>
                <td>
                  {isEditing && selectedAppointment === appointment ? (
                    <button onClick={handleSaveClick}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(appointment)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default DentistPage;
