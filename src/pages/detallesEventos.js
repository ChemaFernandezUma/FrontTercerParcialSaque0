import React from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const DetallesEventos = () => {
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

    return (
        <div>
            <Navbar />
            {evento == null ? <h1>No se ha encontrado el evento</h1> : 
            <div className="card bg-gray col-md-6 eventos">
                <h3>Nombre del evento: {evento.nombre}</h3>
                <p>Organizador: {evento.organizador}</p>
                <p>Fecha: {evento.timestamp}</p>
                <p>Lugar: {evento.lugar}</p>
                <p>latitud {evento.lat} </p>
                <p>longitud {evento.lon} </p>
            </div>}
        </div>
    );
}

export default DetallesEventos;