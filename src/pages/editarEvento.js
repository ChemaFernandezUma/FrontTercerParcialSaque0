import React from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { useState } from 'react';
import { useParams } from 'react-router-dom';


const EditarEvento = () => {

    const [evento, setEvento] = useState(null);
    const id = useParams().id;

    useEffect(() => {
        axios.get("http://localhost:5001/eventos/" + id).then((response) => {
            setEvento(response.data);
            console.log(response.data);
        })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const editarEvento = async () => {
        var nombre = document.getElementById("nombre").value;
        if (nombre == "") {
            nombre = evento.nombre;
        }

        var lugar = document.getElementById("lugar").value;
        if (lugar == "") {
            lugar = evento.lugar;
        }
        var fecha = document.getElementById("fecha").value;
        if (fecha == "") {
            fecha = evento.timestamp;
        }

        var hora = document.getElementById("hora").value;
        if (hora == "") {
            hora = evento.timestamp;
        }else{
            fecha = fecha + "T" + hora;
        }

        var organizador = localStorage.getItem("email");
        
        var latitud = evento.lat;
        var longitud = evento.lon;
        if (lugar != "") {
            axios.get("https://nominatim.openstreetmap.org/search?q=" + lugar + "&format=json&polygon=1&addressdetails=1").then(async (response) => {
                if (response.data.length == 0) {
                    alert("No se ha encontrado la direccion")
                    return;
                }
                latitud = response.data[0].lat;
                 longitud = response.data[0].lon;
            })
        }
        axios.put("http://localhost:5001/eventos/" + id, {
            nombre: nombre,
            lugar: lugar,
            timestamp: fecha ,
            organizador: organizador,
            lat: latitud,
            lon: longitud
        }).then((response) => {
            alert("Evento editado");
            window.location.href = "http://localhost:3000/";
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <Navbar />
            {evento == null ? <h1>No se ha encontrado el evento</h1> :
                <div className="container">
                    <h1 className="text-center">Editar evento</h1>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre del evento</label>
                            <input type="text" className="form-control" id="nombre"  />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lugar" className="form-label">Lugar</label>
                            <input type="text" className="form-control" id="lugar" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fecha" className="form-label">Fecha</label>
                            <input type="date" className="form-control" id="fecha" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hora" className="form-label">Hora</label>
                            <input type="time" className="form-control" id="hora" />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={editarEvento}>Editar evento</button>
                    </form>
                </div>
            }
        </div>
    );
}

export default EditarEvento;