import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/reserva.css';

export default function Reserva() {
  const location = useLocation();
  const navigate = useNavigate();

  const canchaIdFromLocation = location.state?.canchaId;

  const [cancha, setCancha] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Obtenemos el nombre y correo del localStorage
  const nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  const correoUsuario = localStorage.getItem('correoUsuario') || '';
  const idUsuario = localStorage.getItem('idUsuario') || '';

  const [reserva, setReserva] = useState({
    nombre: nombreUsuario,
    correo: correoUsuario,
    numeroContacto: '',
    fecha: '',
    hora: '',
    cantidadPersonas: 1,
    canchaId: canchaIdFromLocation || '',
  });

  useEffect(() => {
    if (!canchaIdFromLocation) {
      setErrorMessage('No se ha especificado una cancha para reservar. Por favor, selecciona una cancha primero.');
      setIsLoading(false);
      return;
    }

    setReserva(prev => ({ ...prev, canchaId: canchaIdFromLocation }));

    axios.get(`http://localhost:8080/api/cancha/${canchaIdFromLocation}`)
      .then((res) => {
        setCancha(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener la cancha:', err);
        setErrorMessage('Error al cargar los detalles de la cancha. Inténtalo de nuevo.');
        setIsLoading(false);
      });
  }, [canchaIdFromLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reserva.fecha || !reserva.hora) {
      alert('Por favor, selecciona una fecha y hora para la reserva.');
      return;
    }

    const horarioReserva = `${reserva.fecha}T${reserva.hora}:00`;

    const payload = {
      nombre: reserva.nombre,
      correo: reserva.correo,
      numeroContacto: reserva.numeroContacto,
      cantidadPersonas: reserva.cantidadPersonas,
      horarioReserva,
      cancha: { id: parseInt(reserva.canchaId, 10) },
      usuario: { id: parseInt(localStorage.getItem('idUsuario'), 10) } // <--- This line
    };
    try {
      const response = await axios.put('http://localhost:8080/api/reserva', payload);

      if (response.data) {
        navigate('/reserva-exitosa');
      } else {
        navigate('/reserva-fecha');
      }
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      navigate('/reserva-nula');
    }
  };

  if (isLoading) {
    return <div className="reserva-page-container"><p>Cargando información de la reserva...</p></div>;
  }

  if (errorMessage) {
    return (
      <div className="reserva-page-container">
        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
        <button onClick={() => navigate('/canchas')} className="submit-button" style={{ marginTop: '1rem', width: 'auto' }}>
          Volver a Canchas
        </button>
      </div>
    );
  }

  return (
    <div className="reserva-page-container">
      <div className="reserva-content-wrapper">

        {/* Info Cancha */}
        <div className="reserva-card cancha-info-card">
          <div className="cancha-image-placeholder">
            {cancha?.imagen ? (
              <img src={cancha.imagen} alt={cancha.nombre} className="cancha-imagen" />
            ) : (
              <span>{cancha?.nombre || 'Imagen no disponible'}</span>
            )}
          </div>

          <div className="cancha-details">
            <h2>{cancha.nombre}</h2>
            <p className="cancha-precio">${cancha.precio}/hr</p>
            <p className="cancha-capacidad">Cancha apta para {cancha.capacidad} personas</p>
          </div>

          <div className="datetime-selector-group">
            <div className="datetime-section">
              <label htmlFor="fecha" className="datetime-label">Seleccionar fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                className="datetime-input"
                value={reserva.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <div className="datetime-section">
              <label htmlFor="hora" className="datetime-label">Seleccionar hora</label>
              <input
                type="time"
                id="hora"
                name="hora"
                className="datetime-input"
                value={reserva.hora}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="reserva-card reserva-form-card">
          <h2>Información de reserva</h2>
          <p className="form-subtitle">Completa tus datos para finalizar.</p>

          <form onSubmit={handleSubmit} className="reserva-form">
            {/* ✅ Mostramos nombre y correo fijos */}
            <div className="form-group">
              <input
                type="text"
                value={reserva.nombre}
                className="form-input"
                disabled
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                value={reserva.correo}
                className="form-input"
                disabled
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="numeroContacto"
                placeholder="Número de contacto (ej. +573001234567)"
                className="form-input"
                value={reserva.numeroContacto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="cantidadPersonas"
                placeholder="Cantidad de personas"
                min={1}
                max={cancha?.capacidad || 20}
                className="form-input"
                value={reserva.cantidadPersonas}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
