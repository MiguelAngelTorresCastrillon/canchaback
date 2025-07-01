import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/login', { nombre, contrasena });

      // Supongo que el backend devuelve: { id, correo, tipoUsuario, nombre }
      const { tipoUsuario, correo, id, nombre: nombreUsuario } = response.data;

      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('correoUsuario', correo);
     localStorage.setItem('idUsuario', id);
      localStorage.setItem('nombreUsuario', nombreUsuario);

      navigate('/canchas');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>

        {error && <p className="error">{error}</p>}

        <label>Nombre de usuario o correo</label>
        <input
          type="text"
          placeholder="Ingresa tu usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button onClick={handleLogin}>Iniciar sesión</button>

        <button className="register-btn" onClick={handleRegisterRedirect}>
          ¿No tienes cuenta? Regístrate
        </button>

        <a href="#" className="forgot">¿Olvidaste la contraseña?</a>
      </div>
    </div>
  );
};

export default Login;
