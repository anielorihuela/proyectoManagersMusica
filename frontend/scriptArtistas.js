// 🔥 VARIABLES DE PAGINACIÓN
let pagina = 1;
const porPagina = 5;
let datosGlobales = [];

window.onload = async function () {
    const contenedor = document.getElementById('infoArtistas');

    try {
        // 🔥 1. Leer localStorage primero
        const datosGuardados = localStorage.getItem('artistas');

        let artistas;

        if (datosGuardados) {
            artistas = JSON.parse(datosGuardados);
            console.log('Cargando desde localStorage', artistas);
        } else {
            // 🔽 2. Fetch si no hay datos
            const res = await fetch('http://127.0.0.1:8000/v1/artistas');

            if (!res.ok) {
                throw new Error("Error al cargar artistas");
            }

            artistas = await res.json();

            // 🔥 3. Guardar en localStorage
            localStorage.setItem('artistas', JSON.stringify(artistas));
        }

        console.log(artistas);

        // 🔥 PAGINACIÓN (ORDEN CORRECTO)
        datosGlobales = artistas;
        renderizarPagina();

        // 🔥 EVENTOS (delegación)
        contenedor.addEventListener('click', async function (e) {

            const id = e.target.getAttribute('id');

            if (e.target.classList.contains('btn-editar')) {
                window.location.href = `editarArtistas.html?id=${id}`;
            }

            else if (e.target.classList.contains('btn-eliminar')) {

                if (!confirm("¿Seguro que quieres eliminar este artista?")) return;

                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
                        method: "DELETE"
                    });

                    if (resEliminar.ok) {
                        alert("Artista eliminado correctamente");

                        // 🔥 limpiar cache
                        localStorage.removeItem('artistas');

                        location.reload();
                    } else {
                        throw new Error();
                    }

                } catch (error) {
                    alert("Error al eliminar el artista");
                    console.error(error);
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = '<p>Error al cargar artistas</p>';
    }
};


// 🔥 FUNCIÓN DE PAGINACIÓN
async function renderizarPagina() {
    const contenedor = document.getElementById('infoArtistas');
    contenedor.innerHTML = '';

    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;

    const datosPaginados = datosGlobales.slice(inicio, fin);

    await pintarArtistas(datosPaginados);

    renderBotones();
}


// 🔥 BOTONES DE PAGINACIÓN (AQUÍ VA EL PASO 5 BIEN HECHO)
function renderBotones() {
    const contenedor = document.getElementById('infoArtistas');

    const totalPaginas = Math.ceil(datosGlobales.length / porPagina);

    const divBotones = document.createElement('div');
    divBotones.style.marginTop = "20px";

    divBotones.innerHTML = `
        <button id="anterior">⬅ Anterior</button>
        <span style="margin: 0 10px;"> Página ${pagina} de ${totalPaginas} </span>
        <button id="siguiente">Siguiente ➡</button>
    `;

    contenedor.appendChild(divBotones);

    // 🔥 EVENTOS (PASO 5 CORRECTO)
    document.getElementById('anterior').onclick = () => {
        if (pagina > 1) {
            pagina--;
            renderizarPagina();
        }
    };

    document.getElementById('siguiente').onclick = () => {
        if (pagina * porPagina < datosGlobales.length) {
            pagina++;
            renderizarPagina();
        }
    };
}


// 🔥 FUNCIÓN PARA PINTAR ARTISTAS
async function pintarArtistas(artistas) {
    const contenedor = document.getElementById('infoArtistas');

    for (const artista of artistas) {
        const div = document.createElement('div');
        div.classList.add('artista');

        let htmlArtista = `
            <h2>${artista.nombreArtista}</h2>
            <p><strong>Género:</strong> ${artista.generoArtista}</p>
            <p><strong>Popularidad:</strong> ${artista.popularidad}</p>
            <p><strong>Seguidores:</strong> ${artista.seguidores}</p>
            <h4>Álbumes:</h4>
        `;

        // 🔥 traer álbumes
        if (artista.albumes_ids && artista.albumes_ids.length > 0) {

            for (const id_album of artista.albumes_ids) {
                try {
                    const resAlbum = await fetch(`http://127.0.0.1:8000/v1/album/${id_album}`);

                    if (!resAlbum.ok) throw new Error();

                    const album = await resAlbum.json();

                    htmlArtista += `<p>- ${album.nombreAlbum} (${album.generoAlbum})</p>`;

                } catch {
                    htmlArtista += `<p>- Error al cargar álbum</p>`;
                }
            }

        } else {
            htmlArtista += `<p>No tiene álbumes</p>`;
        }

        htmlArtista += `
            <button class="btn-editar" id="${artista.id}">Editar artista</button>
            <button class="btn-eliminar" id="${artista.id}">Eliminar artista</button>
            <hr>
        `;

        div.innerHTML = htmlArtista;
        contenedor.appendChild(div);
    }
}