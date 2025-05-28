import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; 

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/register', {
        nombre,
        contrasena,
      });
      if (res.status === 200) {
        alert('Registro exitoso');
        navigate('/login');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registro</h2>

        {error && <p className="error">{error}</p>}

        <label>Nombre de usuario</label>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button onClick={handleRegister}>Registrarse</button>

        <a href="/login" className="forgot">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
    </div>
  );
};

export default Register;
