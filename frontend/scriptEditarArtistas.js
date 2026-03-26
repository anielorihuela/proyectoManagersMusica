const btnGuardar = document.getElementById('btnGuardar');

btnGuardar.addEventListener('click', guardar_cambios);

async function guardar_cambios() {
    const contenedor = document.getElementById('formEditarArtista');

    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            throw new Error('ID no encontrado en la URL');
        }

        const cambios = {
            nombreArtista: document.getElementById('nombreArtista').value || null,
            generoArtista: document.getElementById('generoArtista').value || null,
            popularidad: document.getElementById('popularidad').value
                ? parseInt(document.getElementById('popularidad').value)
                : null,
            seguidores: document.getElementById('seguidores').value
                ? parseInt(document.getElementById('seguidores').value)
                : null,
            conciertos_ids: document.getElementById('conciertos_ids').value
                ? document.getElementById('conciertos_ids').value
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => id !== '')
                : null,
            albumes_ids: document.getElementById('albumes_ids').value
                ? document.getElementById('albumes_ids').value
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => id !== '')
                : null
        };

        const res = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cambios)
        });

        if (!res.ok) {
            throw new Error('Error al actualizar artista');
        }

        const data = await res.json();
        console.log('Actualizado:', data);

        localStorage.removeItem('artistas');

        alert('Artista actualizado correctamente');
        window.location.href = 'artistas.html';

    } catch (error) {
        console.error(error);

        if (contenedor) {
            contenedor.innerHTML = '<p>Error al actualizar artista</p>';
        } else {
            alert('Error: ' + error.message);
        }
    }
}

console.log("EDITAR ACTUALIZADO");