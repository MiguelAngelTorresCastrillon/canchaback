import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/navbar.css';
import logo from '../assets/LOGO.jpg'; // asegúrate que esté en la carpeta correcta

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, [location.pathname]);

  if (location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><a href="/contacto">Contacto</a></li>
        <li><a href="/canchas">Canchas</a></li>
        <li><a href="/mis-reservas">Mis reservas</a></li>

        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="login-btn">Cerrar sesión</button>
          </li>
        ) : (
          <>
            <li>
              <button onClick={() => navigate('/')} className="login-btn">Login</button>
            </li>
            <li>
              <button onClick={() => navigate('/register')} className="register-btn">Register</button>
            </li>
          </>
        )}
      </ul>
    </nav>

  );
}
