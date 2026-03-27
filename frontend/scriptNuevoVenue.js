const API_BASE = 'http://127.0.0.1:8000/v1';

const btnCrearVenue = document.getElementById('btnCrearVenue');
const mensajeResultado = document.getElementById('mensajeResultado');

btnCrearVenue.addEventListener('click', crearVenue);

async function crearVenue() {
    const nombreVenue = document.getElementById('nombreVenue').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const capacidadTexto = document.getElementById('capacidad').value.trim();

    if (nombreVenue === '' || ubicacion === '' || capacidadTexto === '') {
        mostrarMensaje('Completa todos los campos.', 'danger');
        return;
    }

    const capacidad = parseInt(capacidadTexto);

    if (Number.isNaN(capacidad) || capacidad <= 0) {
        mostrarMensaje('La capacidad debe ser un número mayor que cero.', 'danger');
        return;
    }

    const nuevoVenue = {
        nombreVenue: nombreVenue,
        ubicacion: ubicacion,
        capacidad: capacidad
    };

    try {
        const res = await fetch(`${API_BASE}/venue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoVenue)
        });

        const texto = await res.text();

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        mostrarMensaje('Venue creado correctamente.', 'success');

        document.getElementById('nombreVenue').value = '';
        document.getElementById('ubicacion').value = '';
        document.getElementById('capacidad').value = '';

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, 'danger');
    }
}

function mostrarMensaje(texto, tipo) {
    mensajeResultado.style.display = 'block';
    mensajeResultado.className = `alert alert-${tipo} mt-3`;
    mensajeResultado.textContent = texto;
}