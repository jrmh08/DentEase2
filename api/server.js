const express = require("express");
const path = require("path");
const session = require('express-session');
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const secretKey = '987654321'; // Change this to a secure secret key

////////// LOLLLLLLLLLLLLLLLLLLLLLLLL

app.use(cors());
app.use(express.json());

// Use express-session for session management
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "denteasedb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      // Redirect to the home page after successful logout
      res.redirect('/');
    }
  });
});

// Login route with JWT
app.post("/login", async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  const loginUserQuery = "SELECT * FROM `login/register` WHERE user_email = ?";
  db.query(loginUserQuery, [loginEmail], async (err, result) => {
    if (err) {
      console.error("Error logging in user:", err);
      res.status(500).send("Error logging in user");
    } else if (result.length > 0) {
      const hashedPasswordInDB = result[0].user_password;

      try {
        const passwordMatch = await bcrypt.compare(loginPassword, hashedPasswordInDB);
        if (passwordMatch) {
          const token = jwt.sign({
            userId: result[0].user_id,
            userEmail: result[0].user_email,
            userName: result[0].user_name,
            userPhone: result[0].user_phone,
            user_type: result[0].user_type, // Assuming you have a user_type field in your database ===========================================
          }, secretKey);
          

          res.status(200).json({
            token,
            user: {
              userId: result[0].user_id,
              userName: result[0].user_name,
              userEmail: result[0].user_email,
              userPhone: result[0].user_phone,
            },
          });
        } else {
          console.log("=======================");
          console.log("Incorrect password");
          res.status(401).send("Invalid credentials");
        }
      } catch (bcryptError) {
        console.error("Error comparing passwords:", bcryptError);
        res.status(500).send("Error comparing passwords");
      }
    } else {
      console.log("=======================");
      console.log("User not found");
      res.status(401).send("Invalid credentials");
    }
  });
});

// Register route with JWT
app.post("/register", async (req, res) => {
  const {
    registerUsername,
    registerPhoneNumber,
    registerEmail,
    registerPassword,
    userType,
  } = req.body;

  // Check if the email already exists
  const checkEmailQuery = "SELECT * FROM `login/register` WHERE user_email = ?";
  db.query(checkEmailQuery, [registerEmail], async (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking email:", checkErr);
      res.status(500).send("Error checking email");
    } else if (checkResult.length > 0) {
      // Email already exists, send an error response
      res.status(400).send("Email already exists. Please use a different email.");
    } else {
      // Email doesn't exist, proceed with registration

      try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(registerPassword, 10);

        // Insert the user into the database with the hashed password
        const insertUserQuery = "INSERT INTO `login/register` (user_name, user_phone, user_email, user_password, user_type) VALUES (?, ?, ?, ?, 'Patient')";
        db.query(insertUserQuery, [registerUsername, registerPhoneNumber, registerEmail, hashedPassword, userType], (err, result) => {
          if (err) {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
          } else {
            // Generate a JWT token
            const token = jwt.sign({
              userId: result.insertId,
              userEmail: registerEmail,
              userName: registerUsername,
              userPhone: registerPhoneNumber,
              user_type: userType, // or 'admin' or any other role ==================================================================
            }, secretKey);

            // Log user information
            console.log("User registered successfully");
            console.log("User ID:", result.insertId);
            console.log("User Email:", registerEmail);

            console.log("=======================");
            res.status(200).json({ token });
          }
        });
      } catch (hashingError) {
        console.error("Error hashing password:", hashingError);
        res.status(500).send("Error hashing password");
      }
    }
  });
});

//GETTING USER DETAILS FOR THE PROFILE PAGE
app.get('/getUser', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);

    const { userId, userEmail, userName, userPhone, user_type } = decodedToken;

    res.status(200).json({
      userId,
      userName,
      userEmail,
      userPhone,
      user_type,
    });
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// ... (your existing routes for other functionalities)




//APPOINTMENTS SIDE
app.get('/getAppointments', (req, res) => {
  db.query('SELECT * FROM `appointment_table`', (err, data) => {
    console.log(data)
    res.send(data)
  })
})

app.post('/addAppointment', (req, res) => {
  const { service, dentist, patient_name, phone_number, email, date, time, note, status } = req.body;
  db.query('INSERT INTO `appointment_table` (`service`, `dentist`, `patient_name`, `phone_number`, `email`, `date`, `time`, `note`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "pending")', [service, dentist, patient_name, phone_number, email, date, time, note, status], (err,data) => {
    if (err) {
      console.error("Error submitting appointment", err);
      res.status(500).send("Error submitting appointment");
    }
    console.log(`Appointment added with ID: ${data.insertId}`);
    res.status(200).send(`Appointment added with ID: ${data.insertId}`);
  })
})


//FOR GETTING ALL THE APPOINTMENTS
app.get('/getAllAppointments', (req, res) => {
  db.query('SELECT * FROM `appointment_table`', (err, data) => {
    if (err) {
      console.error('Error retrieving appointments:', err);
      res.status(500).send('Error retrieving appointments');
    } else {
      res.status(200).json(data);
    }
  });
});


//FOR DELETING APPOINTMENTS
app.delete('/deleteAppointment/:id', (req, res) => {
  const appointmentId = req.params.id;

  db.query('DELETE FROM `appointment_table` WHERE appointment_id = ?', [appointmentId], (err, result) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).send('Error deleting appointment');
    } else {
      console.log(`Appointment with ID ${appointmentId} deleted successfully`);
      res.status(200).send(`Appointment with ID ${appointmentId} deleted successfully`);
    }
  });
});



app.put('/updateAppStatus/:appointment_id', (req, res) => {
  const { status } = req.body;
  const { appointment_id } = req.params; // Corrected variable name here
  db.query('UPDATE `appointment_table` SET `status` = ? WHERE `appointment_id` = ?', [status, appointment_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating appointment status');
    } else {
      console.log(`Appointment updated to: ${status}`);
      res.status(200).send(`Appointment updated with ID: ${appointment_id}`);
    }
  });
});























// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});