import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/canchas.css';
import { useNavigate } from 'react-router-dom';



const Canchas = () => {
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para el tipo de usuario

  useEffect(() => {

    const tipo = parseInt(localStorage.getItem('tipoUsuario'), 10);
    setTipoUsuario(tipo);
    console.log(tipo);




    axios.get('http://localhost:8080/api/cancha')
      .then(res => setCanchas(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  axios.get('http://localhost:8080/api/reportes/alerta')
    .then(res => {
      if (res.data) {
        alert(`⚠️ Alerta: ${res.data.tipo} - ${res.data.mensaje}`);
      }
    })
    .catch(err => console.error('Error al obtener la alerta:', err));
}, []);



  return (
    <div className="canchas-container">
      <h2>Canchas Disponibles</h2>

      {tipoUsuario === 2 && (
        <button className="btn-crear-cancha" onClick={() => navigate('/gestion')}>
          Gestionar
        </button>
      )}


      <div className="canchas-grid">
        {canchas.map((cancha) => (
          <div className="cancha-card" key={cancha.id}>
            <img src={cancha.imagen} alt={cancha.nombre} className="cancha-imagen" />
            <h3>{cancha.nombre}</h3>
            <p><strong>${cancha.precio}</strong>/hr</p>

            {tipoUsuario === 1 && (
              <button
                className="btn-crear-cancha"
                onClick={() => navigate('/reserva', { state: { canchaId: cancha.id, canchaNombre: cancha.nombre } })}
              >
                Reservar Cancha
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canchas;
