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
  const [mostrarCancelarId, setMostrarCancelarId] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const navigate = useNavigate();

  const tipoUsuario = localStorage.getItem('tipoUsuario'); 

  useEffect(() => {
  if (tipoUsuario === '2') {
    // Administrador: carga todas sin filtro
    cargarReservas();
  } else if (correoUsuario) {
    // Usuario normal: filtra por correo
    cargarReservas(correoUsuario);
  }
}, [correoUsuario, tipoUsuario]);

const cargarReservas = (correo) => {
  setLoading(true);
  axios.get('http://localhost:8080/api/reserva')
    .then(res => {
      let reservasFiltradas = res.data;

      // Solo filtrar por correo si es usuario normal y correo válido
      if (tipoUsuario === '1' && correo) {
        reservasFiltradas = reservasFiltradas.filter(r => r.usuario && r.usuario.correo === correo);
      }

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
    if (!isoString) return 'Sin fecha';
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
        cargarReservas(tipoUsuario === '2' ? null : correoUsuario);
      })
      .catch(err => {
        console.error('Error al actualizar la reserva:', err);
      });
  };

  const cancelarReserva = (idReserva) => {
    axios.post(`http://localhost:8080/api/reserva/${idReserva}/cancelar`, { motivo: motivoCancelacion })
      .then(() => {
        setMostrarCancelarId(null);
        setMotivoCancelacion('');
        cargarReservas(tipoUsuario === '2' ? null : correoUsuario);
      })
      .catch(err => {
        console.error('Error al cancelar la reserva:', err);
      });
  };

  const renderTablaReservas = () => (
    reservas.length === 0 ? (
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
                    <td><input type="text" name="nombre" value={datosEditados.nombre} onChange={handleInputChange} className="form-control" /></td>
                    <td>{reserva.usuario?.correo}</td>
                    <td><input type="datetime-local" name="horarioReserva" value={new Date(datosEditados.horarioReserva).toISOString().slice(0, 16)} onChange={handleInputChange} className="form-control" /></td>
                    <td><input type="number" name="cantidadPersonas" value={datosEditados.cantidadPersonas} onChange={handleInputChange} className="form-control" /></td>
                    <td>
                      <button onClick={guardarCambios} className="btn btn-success btn-sm me-2">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="btn btn-secondary btn-sm">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{reserva.nombre}</td>
                    <td>{reserva.usuario?.correo}</td>
                    <td>{formatFecha(reserva.horarioReserva)}</td>
                    <td>{reserva.cantidadPersonas}</td>
                    <td>
                      <button onClick={() => handleEditarClick(reserva)} className="btn btn-warning btn-sm">Editar</button>
                      <button onClick={() => setMostrarCancelarId(reserva.id)} className="btn btn-danger btn-sm ms-2">Cancelar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate('/canchas')} className="submit-button mt-4">Volver a Canchas</button>
      </>
    )
  );

  return (
    <div className="reserva-page-container">
      <div className="reserva-content-wrapper">
        <div className="reserva-card" style={{ width: '100%' }}>
          <h2>Tus Reservas</h2>

          {tipoUsuario === '1' ? (
            !correoUsuario ? (
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
            ) : renderTablaReservas()
          ) : loading ? (
            <p>Cargando reservas...</p>
          ) : renderTablaReservas()}

          {mostrarCancelarId && (
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Cancelar Reserva</h5>
                    <button type="button" className="btn-close" onClick={() => setMostrarCancelarId(null)}></button>
                  </div>
                  <div className="modal-body">
                    <p>Motivo de cancelación:</p>
                    <textarea
                      value={motivoCancelacion}
                      onChange={(e) => setMotivoCancelacion(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => cancelarReserva(mostrarCancelarId)} className="btn btn-danger">Confirmar Cancelación</button>
                    <button onClick={() => setMostrarCancelarId(null)} className="btn btn-secondary">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
