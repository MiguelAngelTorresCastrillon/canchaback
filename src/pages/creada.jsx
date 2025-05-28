import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/creada.css'; // Asegúrate que la ruta sea correcta

const CanchaCreada = () => {
  const navigate = useNavigate();

  return (
    <div className="reserva-exitosa-container">
      <h2>Cancha creada con exito!</h2> 

      <svg className="success-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="black" />
        <path d="M8 12l2.5 2.5L16 9" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <button
        className="reserva-exitosa-button"
        onClick={() => navigate('/canchas')}
      >
        Volver a Inicio
      </button>
    </div>  
  );
};

export default CanchaCreada;
