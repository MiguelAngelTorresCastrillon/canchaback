import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; 

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Correcto

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/login', { nombre, contrasena });
      const { tipoUsuario } = res.data;
      console.log(tipoUsuario);

      localStorage.setItem('tipoUsuario', tipoUsuario); 
         localStorage.setItem('isLoggedIn', 'true'); 

      navigate('/canchas'); // Redirigir a /canchas
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="text"
          placeholder="Value"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Value"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button className="register-btn" onClick={handleRegisterRedirect}>
          ¿No tienes cuenta? Regístrate
        </button>

        <hr />
        <button onClick={handleLogin}>Login</button>

        <a href="#" className="forgot">¿Olvidaste la contraseña?</a>
      </div>
    </div>
  );
};

export default Login;
