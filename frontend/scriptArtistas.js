window.onload = async function() {
    const contenedor = document.getElementById('infoArtistas');

    try {
        // 1. Leer localStorage primero
        const datosGuardados = localStorage.getItem('artistas');

        let artistas;

        if (datosGuardados) {
            artistas = JSON.parse(datosGuardados);
            console.log('Cargando desde localStorage', artistas);
        } else {
            // 2. Si no hay datos, hacer fetch
            const res = await fetch('http://127.0.0.1:8000/v1/artistas');
            if (!res.ok) throw new Error("Error al cargar artistas");

            artistas = await res.json();

            // 3. Guardar en localStorage
            localStorage.setItem('artistas', JSON.stringify(artistas));
        }

        console.log(artistas);

        // 4. Limpiar contenedor
        contenedor.innerHTML = "";

        // 5. Mostrar artistas
        for (const artista of artistas) {
            let htmlArtista = `
                <div class="artista">
                    <h2>${artista.nombreArtista}</h2>
                    <p>Género: ${artista.generoArtista}</p>
                    <p>Popularidad: ${artista.popularidad}</p>
                    <p>Seguidores: ${artista.seguidores}</p>
                    <h4>Álbumes:</h4>
            `;

            // 6. Traer álbumes
            for (const id_album of artista.albumes_ids) {
                const resAlbum = await fetch(`http://127.0.0.1:8000/v1/album/${id_album}`);
                if (!resAlbum.ok) throw new Error(`Error al cargar álbum ${id_album}`);

                const album = await resAlbum.json();
                htmlArtista += `<p>- ${album.nombreAlbum} (${album.generoAlbum})</p>`;
            }

            // 7. Botones
            htmlArtista += `
                <button class="btn-editar" id="${artista.id}">Editar artista</button>
                <button class="btn-eliminar" id="${artista.id}">Eliminar artista</button>
                <hr>
            `;

            contenedor.innerHTML += htmlArtista;
        }

        // 8. Eventos
        contenedor.addEventListener('click', async function(e) {

            if (e.target.classList.contains('btn-editar')) {
                const id = e.target.getAttribute('id');
                window.location.href = `editarArtistas.html?id=${id}`;
            }

            else if (e.target.classList.contains('btn-eliminar')) {
                const id = e.target.getAttribute('id');

                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
                        method: "DELETE"
                    });

                    if (resEliminar.ok) {
                        alert("Artista eliminado correctamente");

                        // limpiar cache
                        localStorage.removeItem('artistas');

                        location.reload();
                    } else {
                        alert("No se pudo eliminar al artista");
                    }

                } catch (error) {
                    alert("Error al eliminar: " + error.message);
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p>Error al cargar artistas</p>';
    }
};