window.onload = async function () {
    const form = document.getElementById('formEditarArtista');
    form.onsubmit = guardar_cambios;

    // Cargar datos del artista
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            throw new Error('ID no encontrado en la URL');
        }

        const res = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`);

        if (!res.ok) {
            throw new Error('No se pudo cargar el artista');
        }

        const artista = await res.json();

        // Llenar el formulario con los datos del artista
        document.getElementById('nombre').value = artista.nombreArtista || '';
        document.getElementById('generoArtista').value = artista.generoArtista || '';
        document.getElementById('popularidad').value = artista.popularidad || 0;
        document.getElementById('seguidores').value = artista.seguidores || 0;
        document.getElementById('conciertos_ids').value = artista.conciertos_ids ? artista.conciertos_ids.join(', ') : '';
        document.getElementById('albumes_ids').value = artista.albumes_ids ? artista.albumes_ids.join(', ') : '';

    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos del artista: ' + error.message);
        window.location.href = 'artistas.html';
    }
};

async function guardar_cambios(e) {
    e.preventDefault();

    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            throw new Error('ID no encontrado en la URL');
        }

        const metodo = document.getElementById('tipoMetodo').value;

        const cambios = {
            nombreArtista: document.getElementById('nombre').value || null,
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
                    .filter(id => id.length > 0)
                : [],
            albumes_ids: document.getElementById('albumes_ids').value
                ? document.getElementById('albumes_ids').value
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => id.length > 0)
                : []
        };

        const res = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cambios)
        });

        if (!res.ok) {
            throw new Error('Error al actualizar artista');
        }

        const data = await res.json();
        console.log('Actualizado:', data);

        localStorage.removeItem('artistas');

        alert('✅ Artista actualizado correctamente');

        window.location.href = 'artistas.html';

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
    }
}