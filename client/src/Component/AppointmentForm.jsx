import React, { useState } from "react";

function AppointmentForm({ createEvent }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = `${formData.date}T${formData.time}:00`;
    const event = {
      summary: "Dentist Appointment",
      description: formData.description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: "America/New_York",
      },
    };
    createEvent(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />
      <textarea name="description" onChange={handleChange} placeholder="Description" />
      <button type="submit">Create Appointment</button>
    </form>
  );
}

export default AppointmentForm;
