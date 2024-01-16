import React from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const CrearEvento = () => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dgqruvvjr' } });

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            alert("No has iniciado sesion");
            window.location.href = "http://localhost:3000/";
        }
    }, []);

    const crearEvento = async () => {
        var nombre = document.getElementById("nombre").value;
        var lugar = document.getElementById("lugar").value;
        var fecha = document.getElementById("fecha").value;
        var hora = document.getElementById("hora").value;
        var organizador = localStorage.getItem("email");
        var imagenes = document.getElementById("imagenes").files;

        const cloudinaryUploadPromises = Array.from(imagenes).map(async (imagen) => {
            const formData = new FormData();
            formData.append('imagen', imagen);

            // Devolvemos la promesa de la subida de la imagen
            return axios.post('http://localhost:5001/cloud/subir', formData).then((response) => {
                console.log(response.data);
                return response.data.imageUrl;
            });


        });
        console.log(cloudinaryUploadPromises);

        axios.get("https://nominatim.openstreetmap.org/search?q=" + lugar + "&format=json&polygon=1&addressdetails=1").then(async (response) => {
            if (response.data.length == 0) {
                alert("No se ha encontrado la direccion")
                return;
            }
            var latitud = response.data[0].lat;
            var longitud = response.data[0].lon;

            Promise.all(cloudinaryUploadPromises)
                .then(async (imagenesRL) => {
                    console.log(imagenesRL);
                    var url = "http://localhost:5001/eventos";
                    var respuesta = await axios.post(url, {
                        nombre: nombre,
                        lugar: lugar,
                        timestamp: fecha + "T" + hora + ":00.000Z",
                        organizador: organizador,
                        lat: latitud,
                        lon: longitud,
                        imagen: imagenesRL[0]

                    });
                    alert("Evento creado");
                    window.location.href = "http://localhost:3000/";
                })
        })
    }
    return (
        <div>
            <Navbar />
            <div className="container">
                <h1 className="text-center">Crear evento</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre del evento</label>
                        <input type="text" className="form-control" id="nombre" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lugar" className="form-label">Lugar</label>
                        <input type="text" className="form-control" id="lugar" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fecha" className="form-label">Fecha</label>
                        <input type="date" className="form-control" id="fecha" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="hora" className="form-label">Hora</label>
                        <input type="time" className="form-control" id="hora" required/>
                    </div>
                    <label htmlFor="imagenes" className="form-label">
                        Imágenes
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        name="imagenes"
                        required
                        id="imagenes"
                    />
                    <button type="button" className="btn btn-primary" onClick={crearEvento}>Crear evento</button>
                </form>
            </div>
        </div>
    );
}

export default CrearEvento;