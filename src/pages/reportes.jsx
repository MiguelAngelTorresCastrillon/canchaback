import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Reportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [usoCanchas, setUsoCanchas] = useState([]);
  const [tipoAlerta, setTipoAlerta] = useState('Mantenimiento');
  const [alertas, setAlertas] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    axios.get('http://localhost:8080/api/reportes/usuarios').then(res => setUsuarios(res.data));
    axios.get('http://localhost:8080/api/reportes/reservas').then(res => setReservas(res.data));
    axios.get('http://localhost:8080/api/reportes/uso-canchas').then(res => setUsoCanchas(res.data));
    axios.get('http://localhost:8080/api/reportes/alertas').then(res => setAlertas(res.data));
  };

  const generarAlerta = () => {
    const mensaje = `Se generó una alerta de tipo: ${tipoAlerta}`;
    axios.post('http://localhost:8080/api/reportes/alerta', { tipo: tipoAlerta, mensaje })
      .then(() => {
        alert('✅ Alerta generada');
        cargarDatos();
      })
      .catch(err => console.error('Error al generar alerta', err));
  };

  const cambiarEstadoAlerta = (id, activa) => {
    axios.put(`http://localhost:8080/api/reportes/alerta/${id}/estado`, { activa: !activa })
      .then(() => cargarDatos())
      .catch(err => console.error('Error al cambiar estado de la alerta', err));
  };

  // Contar usuarios por tipo
  const usuariosPorTipo = [
    { name: 'Cliente', value: usuarios.filter(u => u.tipoUsuario === 1).length },
    { name: 'Administrador', value: usuarios.filter(u => u.tipoUsuario !== 1).length },
  ];

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📊 Reportes Administrativos</h2>

      <div className="mb-4 p-3 bg-light rounded shadow-sm">
        <label className="form-label fw-bold">Tipo de alerta:</label>
        <div className="input-group">
          <select value={tipoAlerta} onChange={e => setTipoAlerta(e.target.value)} className="form-select">
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Actualización">Actualización</option>
            <option value="Pruebas">Pruebas</option>
          </select>
          <button onClick={generarAlerta} className="btn btn-warning">Generar alerta</button>
        </div>
      </div>

      <div className="mb-4">
        <h4>🚨 Alertas generadas</h4>
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.tipo}</td>
                <td>{a.mensaje}</td>
                <td>
                  {a.activa ? (
                    <span className="badge bg-success">Activa</span>
                  ) : (
                    <span className="badge bg-secondary">Inactiva</span>
                  )}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${a.activa ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => cambiarEstadoAlerta(a.id, a.activa)}
                  >
                    {a.activa ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagrama de torta usuarios */}
      <div className="mb-5">
        <h4 className="text-center">👤 Distribución de usuarios</h4>
        <div className="d-flex justify-content-center">
          <PieChart width={400} height={300}>
            <Pie
              data={usuariosPorTipo}
              cx="50%"
              cy="50%"
              label
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {usuariosPorTipo.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Diagrama de barras uso de canchas */}
      <div className="mb-5">
        <h4 className="text-center">🏟️ Uso de canchas (veces reservadas)</h4>
        <div className="d-flex justify-content-center">
          <BarChart width={600} height={300} data={usoCanchas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vecesReservada" fill="#00C49F" />
          </BarChart>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="mb-4">
        <h4>👥 Usuarios registrados</h4>
        <table className="table table-striped">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Tipo Usuario</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.tipoUsuario === 1 ? 'Cliente' : 'Administrador'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de reservas */}
      <div className="mb-4">
        <h4>📅 Reservas registradas</h4>
        <table className="table table-striped">
          <thead>
            <tr><th>Nombre</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {reservas.map(r => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{new Date(r.horarioReserva).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
