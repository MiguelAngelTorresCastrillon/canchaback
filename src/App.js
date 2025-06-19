import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Canchas from './pages/cancha';
import Gestion from './pages/gestion';
import Navbar from './pages/navbar';
import Contacto from './pages/contacto';
import Reserva from './pages/reserva';
import ReservaExitosa from './pages/reserva-exitosa';
import CanchaCreada from './pages/creada';
import ReservaFecha from './pages/reserva-no-horarios'
import MisReservas from './pages/MisReservas'

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/gestion" element={<Gestion/>} />
        <Route path="/contacto" element={<Contacto/>} />
        <Route path="/reserva" element={<Reserva/>} />
        <Route path="/reserva-exitosa" element={<ReservaExitosa/>} />
        <Route path="/CanchaCreada" element={<CanchaCreada />} />
        <Route path="/reserva-fecha" element={<ReservaFecha/>} />
<Route path="/mis-reservas" element={<MisReservas />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
