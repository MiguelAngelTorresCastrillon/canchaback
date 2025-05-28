import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/reserva.css'; 


export default function Reserva() {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos el canchaId pasado desde el componente Canchas
  // Es importante que Canchas.js envíe location.state.canchaId
  const canchaIdFromLocation = location.state?.canchaId;

  const [cancha, setCancha] = useState(null); // Para guardar los detalles de la cancha seleccionada
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores al usuario

  const [reserva, setReserva] = useState({
    nombre: '',
    correo: '',
    numeroContacto: '',
    fecha: '',
    hora: '',
    cantidadPersonas: 1,
    canchaId: canchaIdFromLocation || '', // Inicializamos con el ID de la cancha
  });

  useEffect(() => {
    if (!canchaIdFromLocation) {
      setErrorMessage('No se ha especificado una cancha para reservar. Por favor, selecciona una cancha primero.');
      setIsLoading(false);
      // Opcionalmente, redirigir después de un momento:
      // setTimeout(() => navigate('/canchas'), 3000);
      return;
    }

    // Actualiza el estado 'reserva' con el canchaId si no se hizo en la inicialización
    // (aunque la inicialización ya lo debería cubrir)
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
  }, [canchaIdFromLocation]); // Dependencia para re-ejecutar si cambia (aunque no debería en este flujo)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reserva.canchaId) {
        alert('Error: No se ha identificado la cancha para la reserva. Por favor, vuelve a la página de canchas y selecciona una.');
        return;
    }
    if (!reserva.fecha || !reserva.hora) {
        alert('Por favor, selecciona una fecha y hora para la reserva.');
        return;
    }


    const horarioReserva = `${reserva.fecha}T${reserva.hora}:00`; // Asumiendo que el backend espera este formato
    
    // Preparamos el payload final. Nos aseguramos que canchaId es un número.
    const payload = {
      ...reserva,
      horarioReserva,
      canchaId: parseInt(reserva.canchaId, 10), // Aseguramos que es un entero base 10
    };

    try {
      // Asegúrate que tu backend espera un PUT en /api/reserva y el payload correcto
      await axios.put('http://localhost:8080/api/reserva', payload);
      navigate('/reserva-exitosa');

    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      // Intentar mostrar un mensaje de error más específico si el backend lo envía
      const backendError = error.response?.data?.message || error.response?.data?.error || 'Error al guardar la reserva. Verifica los datos e inténtalo de nuevo.';
      alert(backendError);
    }
  };

  if (isLoading) {
    return <div className="reserva-page-container"><p>Cargando información de la reserva...</p></div>;
  }

  if (errorMessage) {
    return (
      <div className="reserva-page-container">
        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
        <button onClick={() => navigate('/canchas')} className="submit-button" style={{marginTop: '1rem', width: 'auto'}}>
          Volver a Canchas
        </button>
      </div>
    );
  }
  
  // Si no hay cancha cargada (y no es por un error ya manejado), mostramos un mensaje genérico
  // Esto puede pasar si canchaIdFromLocation es válido pero la cancha no se encuentra en el backend
  if (!cancha) {
    return (
      <div className="reserva-page-container">
        <p style={{ color: 'red', textAlign: 'center' }}>
            No se pudieron cargar los detalles de la cancha seleccionada.
        </p>
        <button onClick={() => navigate('/canchas')} className="submit-button" style={{marginTop: '1rem', width: 'auto'}}>
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
            {cancha?.imagenUrl ? (
              <img src={cancha.imagenUrl} alt={cancha.nombre} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
            ) : (
              <span>{cancha?.nombre || 'Imagen no disponible'}</span>
            )}
          </div>

          {cancha && (
            <div className="cancha-details">
              <h2>{cancha.nombre}</h2>
              <p className="cancha-precio">${cancha.precio}/hr</p>
              <p className="cancha-capacidad">Cancha apta para {cancha.capacidad} personas</p>
            </div>
          )}

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
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                className="form-input"
                value={reserva.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                className="form-input"
                value={reserva.correo}
                onChange={handleChange}
                required
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
                max={cancha?.capacidad || 20} // Usa la capacidad de la cancha si está disponible
                className="form-input"
                value={reserva.cantidadPersonas}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading} // Deshabilitar botón mientras carga
            >
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}