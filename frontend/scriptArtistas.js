window.onload = async function() {
    const tablaArtistas = document.getElementById('tablaArtistas');
    const totalArtistas = document.getElementById('totalArtistas');

    try {
        const datosGuardados = localStorage.getItem('artistas');
        let artistas;

        if (datosGuardados) {
            artistas = JSON.parse(datosGuardados);
            console.log('Cargando desde localStorage', artistas);
        } else {
            const res = await fetch('http://127.0.0.1:8000/v1/artistas');
            if (!res.ok) throw new Error("Error al cargar artistas");

            artistas = await res.json();
            localStorage.setItem('artistas', JSON.stringify(artistas));
        }

        console.log(artistas);

        tablaArtistas.innerHTML = "";
        totalArtistas.textContent = artistas.length;

        for (const artista of artistas) {
            let albumesHTML = '<span class="text-muted small">Sin álbumes</span>';

            if (artista.albumes_ids && artista.albumes_ids.length > 0) {
                let albumes = [];

                for (const idAlbum of artista.albumes_ids) {
                    const resAlbum = await fetch(`http://127.0.0.1:8000/v1/album/${idAlbum}`);

                    if (resAlbum.ok) {
                        const album = await resAlbum.json();
                        albumes.push(
                            `<span class="badge text-bg-light border me-1 mb-1">${album.nombreAlbum}</span>`
                        );
                    }
                }

                if (albumes.length > 0) {
                    albumesHTML = albumes.join('');
                }
            }

            tablaArtistas.innerHTML += `
                <tr>
                    <td class="fw-semibold">${artista.id}</td>

                    <td>
                        <div class="fw-semibold">${artista.nombreArtista}</div>
                        <div class="small text-muted">
                            Popularidad: ${artista.popularidad ?? 'N/D'} |
                            Seguidores: ${artista.seguidores ?? 'N/D'}
                        </div>
                        <div class="mt-2">
                            ${albumesHTML}
                        </div>
                    </td>

                    <td>
                        <span class="badge bg-secondary">${artista.generoArtista ?? 'Sin género'}</span>
                    </td>

                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${artista.id}">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${artista.id}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }

        tablaArtistas.addEventListener('click', async function(e) {
            const boton = e.target.closest('button');
            if (!boton) return;

            const id = boton.dataset.id;

            if (boton.classList.contains('btn-editar')) {
                window.location.href = `editarArtistas.html?id=${id}`;
            }

            else if (boton.classList.contains('btn-eliminar')) {
                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
                        method: "DELETE"
                    });

                    if (resEliminar.ok) {
                        alert("Artista eliminado correctamente");
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
        tablaArtistas.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    Error al cargar artistas
                </td>
            </tr>
        `;
    }
};