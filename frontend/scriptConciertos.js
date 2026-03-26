window.onload = async function conciertos() {
    const contenedor = document.getElementById('tablaConciertos');

    try {
        // 🔥 1. Leer localStorage primero
        const datosGuardados = localStorage.getItem('conciertos');

        let artistas;

        if (datosGuardados) {
            artistas = JSON.parse(datosGuardados);
            console.log('Cargando desde localStorage', artistas);

        } else {
            // 🔽 2. Fetch si no hay datos
            const artistasRes = await fetch('http://127.0.0.1:8000/v1/artistas');

            if (!artistasRes.ok) {
                throw new Error('Error al cargar artistas');
            }

            artistas = await artistasRes.json();

            // 🔥 3. Guardar en localStorage
            localStorage.setItem('conciertos', JSON.stringify(artistas));
        }

        // 🔥 4. Pintar conciertos
        await pintarConciertos(artistas);

        // 🔥 5. Eventos
        contenedor.addEventListener('click', async function(e) {

            const id = e.target.getAttribute('data-id');

            if (e.target.classList.contains('btn-editar')) {
                window.location.href = `editarConcierto.html?id=${id}`;
            }

            else if (e.target.classList.contains('btn-eliminar')) {

                if (!confirm("¿Seguro que quieres eliminar este concierto?")) return;

                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/concierto/${id}`, {
                        method: "DELETE"
                    });

                    if (resEliminar.ok) {
                        alert("Concierto eliminado correctamente");

                        // 🔥 limpiar cache
                        localStorage.removeItem('conciertos');

                        location.reload();
                    } else {
                        throw new Error();
                    }

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


// 🔥 FUNCIÓN SEPARADA (igual que en artistas)
async function pintarConciertos(artistas) {
    const contenedor = document.getElementById('tablaConciertos');

    contenedor.innerHTML = "";

    for (const artista of artistas) {

        if (!artista.conciertos_ids || artista.conciertos_ids.length === 0) continue;

        for (const concierto_id of artista.conciertos_ids) {

            try {
                const conciertoRes = await fetch(`http://127.0.0.1:8000/v1/concierto/${concierto_id}`);
                if (!conciertoRes.ok) throw new Error();

                const concierto = await conciertoRes.json();

                const venueRes = await fetch(`http://127.0.0.1:8000/v1/venue/${concierto.venue_id}`);
                if (!venueRes.ok) throw new Error();

                const venue = await venueRes.json();

                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${concierto.id}</td>
                    <td>${concierto.fecha}</td>
                    <td>${venue.nombreVenue}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${concierto.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${concierto.id}">Eliminar</button>
                    </td>
                `;

                contenedor.appendChild(tr);

            } catch {
                console.error("Error cargando concierto o venue");
            }
        }
    }
}