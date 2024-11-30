import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';
import Badge from '@mui/material/Badge';
import '../Styles/Nav_Bar.css';



///CHECKPOINT



const NavBar = ({ notifications }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [activePage, setActivePage] = useState('');
  const [userType, setUserType] = useState('');
  const [hasNewNotifications, setHasNewNotifications] = useState(false); // New state for tracking new notifications
  const location = useLocation();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await fetch('http://localhost:3000/getUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserType(data.user_type);
          } else {
            console.error('Error fetching user type:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching user type:', error.message);
      }
    };

    fetchUserType();
  }, []); 

  useEffect(() => {
    setActivePage(location.pathname);

    const hasNew =
      notifications.length > 0 &&
      notifications.some((notification) => notification !== 'No New Notifications');

    setHasNewNotifications(hasNew);
  }, [location.pathname, notifications]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    // Mark notifications as read when the dropdown is opened
    setHasNewNotifications(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!isNotificationsOpen);
    // Mark notifications as read when the notifications dropdown is opened
    setHasNewNotifications(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <img src="pictures/DentEaseNav.png" alt="Logo" className="logo" />

        <div className="burger-menu" onClick={() => setMenuOpen(!isMenuOpen)}>
          <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
          <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
          <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
        </div>

        <ul className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
          <li className={activePage === '/' ? 'active' : ''}><Link to="/home">Home</Link></li>

          {userType === 'Admin' && (
            <li className={activePage === '/admin' ? 'active' : ''}><Link to="/admin">Appointment Manager</Link></li>
          )}

          {userType === 'Dentist' && (
            <li className={activePage === '/dentist' ? 'active' : ''}><Link to="/dentist">Appointments</Link></li>
          )}

          <li className={activePage === '/about' ? 'active' : ''}><Link to="/about">About</Link></li>
          <li className={activePage === '/service' ? 'active' : ''}><Link to="/service">Services</Link></li>
          <li className={activePage === '/appointments' ? 'active' : ''}><Link to="/appointments">Make an Appointment</Link></li>
        </ul>

        <div className="dropdown">
          <button
            className="profileicon"
            type="button"
            id="notificationsDropdown"
            onClick={toggleNotifications}
          >
            <Badge
              color="error"
              variant="dot"
              invisible={!hasNewNotifications}
            >
            <FontAwesomeIcon icon={faBell} />
            </Badge>
          </button>

          <button
            className="profileicon"
            type="button"
            id="profileDropdown"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faUserCircle} />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu" aria-labelledby="profileDropdown">
              <Link className="dropdown-item" to="/profile">Profile</Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" to="/">Logout</Link>
            </div>
          )}

          {isNotificationsOpen && (
            <div className="notifications-dropdown" aria-labelledby="notificationsDropdown">
              {notifications.map((notification, index) => (
                <p key={index}>{notification}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
