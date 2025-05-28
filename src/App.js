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
        <Route path="/CanchaCreada" element={<CanchaCreada />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
