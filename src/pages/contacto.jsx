import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/contacto.css';

export default function Contacto() {
  const navigate = useNavigate();

  const handleReserva = () => {
    navigate('/canchas');
  };

  return (
    <div className="contacto-container">
      <h1>Contáctanos</h1>
      
      <p className="descripcion">
        En <strong>NEXORA TECH</strong> nos dedicamos a ofrecer soluciones tecnológicas para la gestión eficiente de reservas deportivas. Nuestro objetivo es brindar a los usuarios una experiencia rápida, cómoda y moderna.
      </p>

      <div className="info-contacto">
        <h3>📞 Teléfono de contacto:</h3>
        <p>+57 310 111 1111</p>
      </div>

      <button className="btn-reserva" onClick={handleReserva}>
        Reservar una Cancha
      </button>
    </div>
  );
}
