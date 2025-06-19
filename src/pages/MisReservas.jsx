import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/MisReservas.css';
import { useNavigate } from 'react-router-dom';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState(localStorage.getItem('correoUsuario') || '');
  const [correoInput, setCorreoInput] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [datosEditados, setDatosEditados] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (correoUsuario) {
      cargarReservas(correoUsuario);
    }
  }, [correoUsuario]);

  const cargarReservas = (correo) => {
    setLoading(true);
    axios.get('http://localhost:8080/api/reserva')
      .then(res => {
        const reservasFiltradas = res.data.filter(r => r.correo === correo);
        setReservas(reservasFiltradas);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar las reservas:', err);
        setLoading(false);
      });
  };

  const guardarCorreoYBuscar = () => {
    if (correoInput.trim() === '') return;
    localStorage.setItem('correoUsuario', correoInput.trim());
    setCorreoUsuario(correoInput.trim());
  };

  const formatFecha = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditarClick = (reserva) => {
    setEditandoId(reserva.id);
    setDatosEditados({ ...reserva });
  };

  const handleInputChange = (e) => {
    setDatosEditados({ ...datosEditados, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    axios.put(`http://localhost:8080/api/reserva/${datosEditados.id}`, datosEditados)
      .then(() => {
        setEditandoId(null);
        cargarReservas(correoUsuario);
      })
      .catch(err => {
        console.error('Error al actualizar la reserva:', err);
      });
  };

  return (
    <div className="reserva-page-container">
      <div className="reserva-content-wrapper">
        <div className="reserva-card" style={{ width: '100%' }}>
          <h2>Tus Reservas</h2>

          {!correoUsuario ? (
            <div>
              <p>Por favor ingresa tu correo electrónico para ver tus reservas:</p>
              <input
                type="email"
                value={correoInput}
                onChange={(e) => setCorreoInput(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="form-control mb-2"
              />
              <button onClick={guardarCorreoYBuscar} className="submit-button">Buscar</button>
            </div>
          ) : loading ? (
            <p>Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <p>No tienes reservas registradas.</p>
          ) : (
            <>
              <table className="table table-striped table-hover shadow-sm rounded">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Fecha y Hora</th>
                    <th>Personas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva, idx) => (
                    <tr key={reserva.id}>
                      <td>{idx + 1}</td>

                      {editandoId === reserva.id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="nombre"
                              value={datosEditados.nombre}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="correo"
                              value={datosEditados.correo}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="datetime-local"
                              name="horarioReserva"
                              value={new Date(datosEditados.horarioReserva).toISOString().slice(0, 16)}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="cantidadPersonas"
                              value={datosEditados.cantidadPersonas}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <button onClick={guardarCambios} className="btn btn-success btn-sm me-2">Guardar</button>
                            <button onClick={() => setEditandoId(null)} className="btn btn-secondary btn-sm">Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{reserva.nombre}</td>
                          <td>{reserva.correo}</td>
                          <td>{formatFecha(reserva.horarioReserva)}</td>
                          <td>{reserva.cantidadPersonas}</td>
                          <td>
                            <button onClick={() => handleEditarClick(reserva)} className="btn btn-warning btn-sm">
                              Editar
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={() => navigate('/canchas')} className="submit-button mt-4">
                Volver a Canchas
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
