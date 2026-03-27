const API_BASE = 'http://127.0.0.1:8000/v1';

const btnCrearCancion = document.getElementById('btnCrearCancion');
const mensajeResultado = document.getElementById('mensajeResultado');

btnCrearCancion.addEventListener('click', crearCancion);

async function crearCancion() {
    const nombreCancion = document.getElementById('nombreCancion').value.trim();
    const duracionTexto = document.getElementById('duracionEnSegundos').value.trim();

    if (nombreCancion === '' || duracionTexto === '') {
        mostrarMensaje('Completa todos los campos.', 'danger');
        return;
    }

    const duracionEnSegundos = parseInt(duracionTexto);

    if (Number.isNaN(duracionEnSegundos) || duracionEnSegundos <= 0) {
        mostrarMensaje('La duración debe ser un número mayor que cero.', 'danger');
        return;
    }

    const nuevaCancion = {
        nombreCancion: nombreCancion,
        duracionEnSegundos: duracionEnSegundos
    };

    try {
        const res = await fetch(`${API_BASE}/cancion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCancion)
        });

        const texto = await res.text();

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        mostrarMensaje('Canción creada correctamente.', 'success');

        document.getElementById('nombreCancion').value = '';
        document.getElementById('duracionEnSegundos').value = '';

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