import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";


const StopMarker = (props) => {
  return (
    <Marker position={props.position}>
      <Popup>{props.stopName}</Popup>
    </Marker>
  );
};

function App() {

  const [eventos, setEventos] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [coordenadas, setCoordenadas] = useState([36.719091, -4.416206]);

  const buscarDireccion = async () => {
    var direccion = document.getElementById("direccion").value;
    var url = "https://nominatim.openstreetmap.org/search?q=" + direccion + "&format=json&polygon=1&addressdetails=1";
    var respuesta = await axios.get(url);
    if(respuesta.data.length == 0){
      alert("No se ha encontrado la direccion")
      return;
    }
    console.log(respuesta.data);
    var latitud = respuesta.data[0].lat;
    var longitud = respuesta.data[0].lon;
    setCoordenadas([latitud, longitud]);
    var url2 = "http://localhost:5001/eventos/proximos/"  + latitud + "/" + longitud;
    var respuesta2 = await axios.get(url2);
    console.log(respuesta2.data);
    const markers = respuesta2.data.map((parada) => (
      <StopMarker key={parada._id} position={[parada.lat, parada.lon]} stopName={parada.nombre} />
    ));
    setParadas(markers);
    setEventos(respuesta2.data);
  }


  return (
    <div>
      <Navbar />
      <div id="map">
        <MapContainer center={coordenadas} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
          />
          {/* <Marker position={position}>
                            <Popup>{articulo.nombre}</Popup>
                        </Marker> */}
          {paradas}
        </MapContainer>

      </div>
      <div>
        <h2>Introduce una direccion postal</h2>
        <input type="text" id="direccion" />
        <button className="btn btn-primary" onClick={buscarDireccion}>Buscar</button>
      </div>
      <div>
        <h2 className="textoEventos">Eventos filtrados</h2>
        {eventos.map((evento) => {
          return (
            <div className="card bg-gray col-md-6 eventos" id= {evento._id}>
              <h3>{evento.nombre}</h3>
              <p>{evento.organizador}</p>
              <a href = {"http://localhost:3000/evento/" + evento._id} className="linkToButton">Ver evento</a>
              {(evento.organizador == localStorage.getItem("email")) ?
              <div>
                <button className="btn btn-danger" onClick = {async () => {
                  var url = "http://localhost:5001/eventos/" + evento._id;
                  var respuesta = await axios.delete(url);
                  alert("Evento eliminado");
                  window.location.href = "http://localhost:3000/";
                }}>Eliminar evento</button>
                  <a href = {"http://localhost:3000/editarEvento/" + evento._id} className="btn btn-success">Editar Evento</a>
              </div> : <></>
              }
            </div>
          )
        })}
      </div>
    </div>);
}

export default App;
