import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/gestioncanchas.css';

const GestionCanchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [canchaForm, setCanchaForm] = useState({
    id: null,
    nombre: '',
    precio: '',
    capacidad: '',
    descripcion: '',
    imagen: '',
  });

  useEffect(() => {
    cargarCanchas();
  }, []);

  const cargarCanchas = () => {
    axios.get('http://localhost:8080/api/cancha')
      .then(res => setCanchas(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCanchaForm({ ...canchaForm, [name]: value });
  };
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (canchaForm.id === null) {
      // Crear nueva cancha
      axios.post('http://localhost:8080/api/cancha/crear', canchaForm)
        .then(() => {
          navigate('/CanchaCreada');  
        })
        .catch(err => {
          console.error(err);
          alert('Error al crear la cancha');
        });
    } else {
      // Actualizar cancha existente
      axios.put(`http://localhost:8080/api/cancha/${canchaForm.id}`, canchaForm)
        .then(() => {
          alert('Cancha actualizada correctamente');
          limpiarFormulario();
          cargarCanchas();
        })
        .catch(err => {
          console.error(err);
          alert('Error al actualizar la cancha');
        });
    }
  };

  const eliminarCancha = (id) => {
    axios.delete(`http://localhost:8080/api/cancha/delete/${id}`)
      .then(() => {
        alert('Cancha eliminada');
        cargarCanchas();
      })
      .catch(err => console.error(err));
  };

  const editarCancha = (cancha) => {
    setCanchaForm({ ...cancha });
  };

  const limpiarFormulario = () => {
    setCanchaForm({
      id: null,
      nombre: '',
      precio: '',
      capacidad: '',
      descripcion: '',
      imagen: '',
    });
  };

  return (
    <div className="gestion-canchas">
      <h2>Gestión de Canchas</h2>

      <div className="crear-form">
        <h3>{canchaForm.id ? 'Editar Cancha' : 'Crear Nueva Cancha'}</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={canchaForm.nombre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio por hora"
          value={canchaForm.precio}
          onChange={handleChange}
        />
        <input
          type="number"
          name="capacidad"
          placeholder="Capacidad"
          value={canchaForm.capacidad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={canchaForm.descripcion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de imagen"
          value={canchaForm.imagen}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {canchaForm.id ? 'Actualizar Cancha' : 'Crear Cancha'}
        </button>
        {canchaForm.id && <button onClick={limpiarFormulario}>Cancelar</button>}
      </div>

<div className="cancha-lista">
  <h3>Lista de Canchas</h3>
  {canchas.map((cancha) => (
    <div key={cancha.id} className="cancha-item">
      <img src={cancha.imagen} alt={cancha.nombre} className="cancha-imagen" />
      <div className="cancha-info">
        <h4>{cancha.nombre}</h4>
        <p className="precio">${cancha.precio}/hr</p>
        <p className="capacidad"><strong>Capacidad:</strong> {cancha.capacidad} personas</p>
        <p className="descripcion">{cancha.descripcion}</p>
        <div className="botones">
          <button className="btn editar" onClick={() => editarCancha(cancha)}>Editar</button>
          <button className="btn eliminar" onClick={() => eliminarCancha(cancha.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default GestionCanchas;
