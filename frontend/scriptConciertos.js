let pagina = 1;
const porPagina = 5;
let conciertosGlobales = [];

window.onload = async function () {
    const contenedor = document.getElementById('tablaConciertos');

    try {
        const res = await fetch('http://127.0.0.1:8000/v1/artistas');

        if (!res.ok) {
            throw new Error('Error al cargar artistas');
        }

        const artistas = await res.json();
        conciertosGlobales = await construirListaConciertos(artistas);

        renderizarPagina();

        contenedor.addEventListener('click', async function (e) {
            const boton = e.target.closest('button');
            if (!boton) return;

            const id = boton.getAttribute('data-id');

            if (e.target.classList.contains('btn-editar')) {
                window.location.href = `editarConciertos.html?id=${id}`;
            if (boton.classList.contains('btn-editar')) {
                window.location.href = `editarConcierto.html?id=${id}`;
            }

            else if (boton.classList.contains('btn-eliminar')) {
                if (!confirm("¿Seguro que quieres eliminar este concierto?")) return;

                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/concierto/${id}`, {
                        method: "DELETE"
                    });

                    if (!resEliminar.ok) {
                        throw new Error("No se pudo eliminar el concierto");
                    }

                    alert("Concierto eliminado correctamente");

                    conciertosGlobales = conciertosGlobales.filter(concierto => concierto.id !== id);

                    const totalPaginas = Math.ceil(conciertosGlobales.length / porPagina);
                    if (pagina > totalPaginas && totalPaginas > 0) {
                        pagina = totalPaginas;
                    }

                    renderizarPagina();

                } catch (error) {
                    alert("Error al eliminar el concierto");
                    console.error(error);
                }
            }
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<tr><td colspan="4">Error al cargar conciertos</td></tr>';
    }
};

async function construirListaConciertos(artistas) {
    const conciertos = [];

    for (const artista of artistas) {
        if (!artista.conciertos_ids || artista.conciertos_ids.length === 0) continue;

        for (const concierto_id of artista.conciertos_ids) {
            try {
                const conciertoRes = await fetch(`http://127.0.0.1:8000/v1/concierto/${concierto_id}`);
                if (!conciertoRes.ok) throw new Error("Error al cargar concierto");

                const concierto = await conciertoRes.json();

                const venueRes = await fetch(`http://127.0.0.1:8000/v1/venue/${concierto.venue_id}`);
                if (!venueRes.ok) throw new Error("Error al cargar venue");

                const venue = await venueRes.json();

                conciertos.push({
                    id: concierto.id,
                    fecha: concierto.fecha,
                    nombreVenue: venue.nombreVenue
                });

            } catch (error) {
                console.error("Error cargando concierto o venue:", error);
            }
        }
    }

    return conciertos;
}

function renderizarPagina() {
    const contenedor = document.getElementById('tablaConciertos');
    contenedor.innerHTML = '';

    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;

    const datosPaginados = conciertosGlobales.slice(inicio, fin);

    pintarConciertos(datosPaginados);
    renderBotones();
}

function renderBotones() {
    const tabla = document.getElementById('tablaConciertos');

    const existente = document.getElementById('paginacion');
    if (existente) existente.remove();

    const totalPaginas = Math.ceil(conciertosGlobales.length / porPagina);

    if (totalPaginas <= 1) return;

    const div = document.createElement('div');
    div.id = 'paginacion';
    div.style.marginTop = "20px";

    div.innerHTML = `
        <button id="anterior">⬅ Anterior</button>
        <span style="margin: 0 10px;">Página ${pagina} de ${totalPaginas}</span>
        <button id="siguiente">Siguiente ➡</button>
    `;

    tabla.parentNode.appendChild(div);

    document.getElementById('anterior').onclick = () => {
        if (pagina > 1) {
            pagina--;
            renderizarPagina();
        }
    };

    document.getElementById('siguiente').onclick = () => {
        if (pagina < totalPaginas) {
            pagina++;
            renderizarPagina();
        }
    };
}

function pintarConciertos(conciertos) {
    const contenedor = document.getElementById('tablaConciertos');

    if (conciertos.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="4">No hay conciertos para mostrar</td></tr>';
        return;
    }

    for (const concierto of conciertos) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${concierto.id}</td>
            <td>${concierto.fecha}</td>
            <td>${concierto.nombreVenue}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${concierto.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${concierto.id}">Eliminar</button>
            </td>
        `;

        contenedor.appendChild(tr);
    }
}