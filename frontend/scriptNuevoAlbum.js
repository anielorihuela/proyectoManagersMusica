const API_BASE = 'http://127.0.0.1:8000/v1';

const btnCrearAlbum = document.getElementById('btnCrearAlbum');
const mensajeResultado = document.getElementById('mensajeResultado');

btnCrearAlbum.addEventListener('click', crearAlbum);

async function crearAlbum() {
    const nombreAlbum = document.getElementById('nombreAlbum').value.trim();
    const generoAlbum = document.getElementById('generoAlbum').value.trim();
    const cancionesTexto = document.getElementById('canciones_ids').value.trim();

    if (nombreAlbum === '' || generoAlbum === '') {
        mostrarMensaje('Completa nombre y género del álbum.', 'danger');
        return;
    }

    const canciones_ids = cancionesTexto === ''
        ? []
        : cancionesTexto
            .split(',')
            .map(id => id.trim())
            .filter(id => id !== '');

    const nuevoAlbum = {
        nombreAlbum: nombreAlbum,
        generoAlbum: generoAlbum,
        canciones_ids: canciones_ids
    };

    try {
        const res = await fetch(`${API_BASE}/album`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoAlbum)
        });

        const texto = await res.text();

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        mostrarMensaje('Álbum creado correctamente.', 'success');

        document.getElementById('nombreAlbum').value = '';
        document.getElementById('generoAlbum').value = '';
        document.getElementById('canciones_ids').value = '';

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