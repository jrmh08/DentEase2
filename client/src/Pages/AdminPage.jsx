import React, { useState, useEffect } from 'react';
import '../Styles/AdminPage.css';
import NavBar from '../Component/Nav_Bar';
import Footer from '../Component/Footer';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Admin_Page = () => {
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

  const handleSaveClick = () => {
    setIsEditing(false);
    handleEditFormSubmit();
  };

  const handleDeleteClick = (appointment) => {
    // Perform delete logic here
  
    // For example, you can filter out the selected appointment and update the state
    const updatedAppointments = appointments.filter(
      (item) => item.appointment_id !== appointment.appointment_id
    );
    setAppointments(updatedAppointments);
  
    // Perform the delete operation on the server
    deleteAppointment(appointment);
  };



  const deleteAppointment = async (appointment) => {
    try {
      const response = await fetch(`http://localhost:3000/deleteAppointment/${appointment.appointment_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const newNotification = `Appointment ID: ${appointment.appointment_id} deleted successfully`;
        setNotifications([newNotification, ...notifications.filter(notif => notif !== 'No New Notifications')]);
        console.log('Appointment deleted successfully');
      } else {
        console.error('Error deleting appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
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
              <th>Delete</th>
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
                <td>{appointment.status}</td>
               
                <td>
  {isEditing && selectedAppointment === appointment ? (
    <button onClick={handleSaveClick}>Save</button>
  ) : (
    <>
      <button className='admin-delete' onClick={() => handleDeleteClick(appointment)}>Delete</button>
    </>
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

export default Admin_Page;
