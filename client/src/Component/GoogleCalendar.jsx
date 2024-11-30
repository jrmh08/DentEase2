import React, { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "1047582222950-j7gh1psvto801e8ns851emvvpkna9eup.apps.googleusercontent.com";
const API_KEY = "AIzaSyDRUMQya2XJqyeqRSFTPUfDPHSmohAk_8k";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function GoogleCalendar() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleAuth = async () => {
    const auth = gapi.auth2.getAuthInstance();
    await auth.signIn();
  };

  const handleSignOut = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth.signOut();
  };

  const createEvent = () => {
    const event = {
      summary: "Dentist Appointment",
      description: "A scheduled dentist appointment",
      start: {
        dateTime: "2024-12-10T10:00:00-05:00",
        timeZone: "America/New_York",
      },
      end: {
        dateTime: "2024-12-10T11:00:00-05:00",
        timeZone: "America/New_York",
      },
    };

    gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    }).then((response) => {
      console.log("Event created:", response);
    }).catch((err) => {
      console.error("Error creating event:", err);
    });
  };

  return (
    <div>
      <button onClick={handleAuth}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={createEvent}>Create Event</button>
    </div>
  );
}

export default GoogleCalendar;
