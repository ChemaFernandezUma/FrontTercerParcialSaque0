import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LogInicioSesion from './pages/logsInicioSesion';
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";
import DetallesEventos from './pages/detallesEventos';
import CrearEvento from './pages/crearEvento';
import EditarEvento from './pages/editarEvento';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
             <Route path="/" element={<App />} />
             <Route path="/evento/:id" element={<DetallesEventos />} />
             <Route path='/crearEvento' element={<CrearEvento />} />
              <Route path='/editarEvento/:id' element={<EditarEvento />} />
              <Route path='/logs' element={<LogInicioSesion />} />
              
      </Routes>

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

