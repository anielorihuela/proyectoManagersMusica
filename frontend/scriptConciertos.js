window.onload = async function conciertos() {
    const contenedor = document.getElementById('tablaConciertos');

    try {
        // Leer localStorage primero
        const datosGuardados = localStorage.getItem('conciertos');

        let artistas;

        if (datosGuardados) {
            artistas = JSON.parse(datosGuardados);
            console.log('Cargando desde localStorage', artistas);
        } else {
            // FETCH validado
            const artistasRes = await fetch('http://127.0.0.1:8000/v1/artistas');

            if (!artistasRes.ok) {
                throw new Error('Error al cargar artistas');
            }

            artistas = await artistasRes.json();
            console.log(artistas);

            //  Guardar en localStorage
            localStorage.setItem('conciertos', JSON.stringify(artistas));
        }

        // Limpiar tabla
        contenedor.innerHTML = "";

        // Recorrer artistas
        for (const artista of artistas) {
            let conciertos_ids = artista.conciertos_ids;

            for (const concierto_id of conciertos_ids) {

                const conciertoRes = await fetch(`http://127.0.0.1:8000/v1/concierto/${concierto_id}`);
                if (!conciertoRes.ok) throw new Error("Error al cargar concierto");

                const concierto = await conciertoRes.json();

                const venueRes = await fetch(`http://127.0.0.1:8000/v1/venue/${concierto.venue_id}`);
                if (!venueRes.ok) throw new Error("Error al cargar venue");

                const venue = await venueRes.json();

                contenedor.innerHTML += `
                <tr>
                    <td>${concierto.id}</td>
                    <td>${concierto.fecha}</td>
                    <td>${venue.nombreVenue}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${concierto.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${concierto.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            }
        }

        //Eventos
        contenedor.addEventListener('click', async function(e) {

            if (e.target.classList.contains('btn-editar')) {
                const id = e.target.getAttribute('data-id');
                window.location.href = `editarConcierto.html?id=${id}`;
            }

            else if (e.target.classList.contains('btn-eliminar')) {
                const id = e.target.getAttribute('data-id');

                try {
                    const resEliminar = await fetch(`http://127.0.0.1:8000/v1/concierto/${id}`, {
                        method: "DELETE"
                    });

                    if (resEliminar.ok) {
                        alert("Concierto eliminado correctamente");

                        // limpiar localStorage
                        localStorage.removeItem('conciertos');

                        location.reload();
                    } else {
                        const error = await resEliminar.json();
                        alert("No se pudo eliminar el concierto: " + (error.detail || "Error desconocido"));
                    }

                } catch (error) {
                    alert("Error al eliminar el concierto: " + error.message);
                }
            }
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<tr><td colspan="4">Error al cargar conciertos</td></tr>';
    }
};