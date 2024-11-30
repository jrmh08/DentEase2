import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/About_Us.css';
import NavBar from '../Component/Nav_Bar';
import Footer from '../Component/Footer';

const AboutUs = () => {
  const [notifications, setNotifications] = useState(['No New Notifications']);

  return (
    
    <div className="home-page">
      <NavBar notifications={notifications} />
      <div className="content-container">
        <div className="text-column">

          <h1>About Us</h1>
          <p>
          Welcome to DentEase Dental Clinic, where your smile is our priority. At DentEase, we seamlessly blend advanced dental care with modern convenience, offering a patient-centric approach through innovative solutions like DentEase Booking. Our commitment extends beyond treatment – it's about making your oral health journey effortless and aligned with your contemporary lifestyle. Discover a dental experience that prioritizes your well-being and embraces the future of dentistry at DentEase Dental Clinic.
          </p>
          <h3>Planting Roots in Talamban</h3>
          <p>
          Nurturing smiles and planting roots in Talamban, DentEase Dental Clinic is proud to be your trusted local dental care destination. Our commitment to exceptional oral health extends to the heart of the community we serve, ensuring that every patient feels at home while receiving top-notch dental care. Just as our roots deepen in Talamban, so does our dedication to providing personalized, modern, and accessible dentistry for you and your family. 
          </p>
        </div>
        <div className="image-column">
          <img src="../pictures/aurora_dental.jpg" alt="Your Image" className="circular-image" />
        </div>
      </div>

      <div className="boxes-container">
        <div className="feature-box">
          <h2>Relax in Our Cheerful Environment</h2>
          <p>
            Perhaps you've been to other dental practices in the past that have felt more clinical. That’s not the case at our office. Here, patient comfort is paramount! We have large windows, allowing lots of sunlight to brighten our space. Netflix is available for your viewing pleasure while you receive dental treatment.
          </p>
        </div>
        <div className="feature-box">
          <h2>Helping Patients Feel Comfortable</h2>
          <p>
            Perhaps you had a negative experience going to the dentist as a child. We understand that dental anxiety is real. That’s why we do everything we can to put patients at ease. Our care is gentle and we offer sedation options.
          </p>
        </div>
        <div className="feature-box">
          <h2>Maintaining a Presence in the Community</h2>
          <p>
            As patient education is a big part of what we do, we will be holding various events in our community. These will include free checkups and presentations to local schools. We want our patients and those in the community to enjoy healthy, happy smiles!
          </p>
        </div>
      </div>
<div className="additional-feature">
        <h2>Helping Families Achieve Healthy Smiles</h2>
        <p>
          At our family dental practice, we especially love seeing entire families visit us for dental care. From toddlers and school-aged kids to teens and adults, patients of all ages are welcome in our dental office.
        </p>
        <p>
          One of our greatest passions is helping children adopt good oral hygiene habits so they can keep their teeth healthy and their smiles lovely.
        </p>

        <Link to="/service" className="meet-dentists-btn">
          MEET OUR DENTISTS 
      </Link>
      </div>

      <div className="bottom-feature">
        <h2>Providing an Array of Services</h2>
        <p>
          You don’t have to visit several dental offices to get the care you need. We offer patients many high-quality dental services in one convenient location at Gov. M. Cuenco Ave, Cebu City, 6000 Cebu.
        </p>
      </div>

      <div className="appointment">
        <h2>Book an Appointment</h2>
        <p>
          Contact our dental office today to schedule a convenient Saturday or same-day appointment.
        </p>
      </div>
      <Footer />

    </div>
  );
};

export default AboutUs;
