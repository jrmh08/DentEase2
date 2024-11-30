// Homepage.jsx

import React, { useState, useEffect } from 'react';
import '../Styles/Home_Page.css';
import NavBar from '../Component/Nav_Bar';
import Footer from '../Component/Footer';

const Homepage = () => {
  const [notifications, setNotifications] = useState(['No New Notifications']);
  const images = [
    '../pictures/carousel_1.jpg',
    '../pictures/carousel_2.jpg',
    '../pictures/carousel_3.webp'
  ];

  const texts = [
    "DentEase: Where Smiles Begin with Ease!",
    "Seamless Dentistry, Radiant Smiles Await",
    "Transform Your Oral Health with DentEase Excellence",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prevImage) => (prevImage === 0 ? images.length - 1 : prevImage - 1));
  };

  const handleNext = () => {
    setCurrentImage((prevImage) => (prevImage === images.length - 1 ? 0 : prevImage + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="HomePage-container">
      {/* Top Section */}
      <NavBar notifications={notifications} />
  
      <div className="homepage-carousel-container">
        <div className="homepage-text-container">
          <h1>PARTNERS IN DENTAL HEALTH</h1>
          <p className="homepage-text">{texts[currentImage]}</p>
        </div>
        <div className="homepage-image-container">
          <img
            src={images[currentImage]}
            alt={`Image ${currentImage + 1}`}
            className="homepage-carousel-image"
          />
          <button className="carousel-button prev" onClick={handlePrev}>
            &lt; 
          </button>
          <button className="carousel-button next" onClick={handleNext}>
            &gt; 
          </button>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="facilities">
        <div className="facilities-text-wrapper">
          <h1 className="facilities-text">OUR SERVICES</h1>
          <p className="facilities-text">What Facilities We Provided</p>
        </div>
        <div className="facility-boxes">
          <div className="facility-box left-box">
            <img
              src="../pictures/carousel1.jpg"
              alt="Orthodontist Image"
              className="facility-image"
            />
            <h3>Orthodontist</h3>
            <p>
              Correct misalignments seamlessly with our specialized facility. Equipped with
              cutting-edge tools, X-ray, and 3D imaging for precise treatment plans. Our space ensures
              a comfortable fit for braces, retainers, and aligners. Your journey to a straighter smile
              starts here.
            </p>
          </div>
          <div className="facility-box middle-box">
            <img
              src="../pictures/carousel2.jpg"
              alt="Periodontist Image"
              className="facility-image"
            />
            <h3>Periodontist</h3>
            <p>
              Experience comprehensive care in our periodontal facility. Specialized tools for deep
              cleanings, scaling, and root planing procedures ensure optimal gum health. Our advanced
              equipment diagnoses and monitors gum conditions with precision. Collaborative efforts
              with general dentists guarantee your overall oral health. Your journey to healthy gums
              begins with us.
            </p>
          </div>
          <div className="facility-box right-box">
            <img
              src="../pictures/carousel3.jpg"
              alt="Endodontist Image"
              className="facility-image"
            />
            <h3>Endodontist</h3>
            <p>
              Discover top-tier care in our specialized facility. Treatment rooms feature advanced
              imaging for precise root issue diagnosis. Specialized instruments ensure expert root canal
              treatments and procedures. Our commitment to a sterile environment safeguards against
              infections, providing a secure haven for delicate procedures. Entrust your root health to
              our expertise.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-container">
        <div className="contact-info">
          <div className="office-hours">
            <h3>Office Hours</h3>
            <table className="office-hours-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>10:00 AM - 5:00 PM</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>9:00 AM - 5:00 PM</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>9:00 AM - 5:00 PM</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>11:00 AM - 7:00 PM</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>10:00 AM - 7:00 PM</td>
                </tr>
              </tbody>
            </table>
            <div className="contact-heading">
              <h2>Contact DentEase Dental Clinic</h2>
              <p>We'd Love to Hear from You! Call (+63) 927 815 7638</p>
            </div>
          </div>
          <div className="find-us">
            <h3>Find Us</h3>
            <p>
              Our Clinic is located in Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, next to Rosedale Place.
              Book your appointment online today.
            </p>
            <img src="pictures/location.png" alt="DentEase Location" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;