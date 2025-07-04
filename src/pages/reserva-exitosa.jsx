// src/pages/ReservaExitosa.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/reserva-exitosa.css'; 

export default function ReservaExitosa() {
  const navigate = useNavigate();

  return (
    <div className="reserva-exitosa-container">
      <h2>¡Reserva realizada con éxito!</h2>
      <p>Te hemos enviado los detalles de la reserva a tu correo.</p>

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
}
