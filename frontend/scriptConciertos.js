window.onload = async function conciertos() {
    const contenedor = document.getElementById('infoConciertos');

    // 1. Buscamos artistas
    const artistasRes = await fetch('http://127.0.0.1:8000/v1/artistas');
    const artistas = await artistasRes.json();

    // Para cada artista...
    for (const artista of artistas) {
        contenedor.innerHTML += `<h4>${artista.nombreArtista}</h4><br>`;
        let conciertos_ids = artista.conciertos_ids;

        // ... Ubicamos sus conciertos
        for (const concierto_id of conciertos_ids) {
            const conciertoRes = await fetch(`http://127.0.0.1:8000/v1/concierto/${concierto_id}`);
            const concierto = await conciertoRes.json();

            // Cada concierto se asocia a un venue
            const venue_id = concierto.venue_id;
            const venuRes = await fetch(`http://127.0.0.1:8000/v1/venue/${venue_id}`);
            const venue = await venuRes.json();

            // Mostrar información del concierto
            contenedor.innerHTML += `<p>Fecha: ${concierto.fecha}</p>`;
            contenedor.innerHTML += `<p>Costo del boleto: ${concierto.costoBoleto}</p>`;
            contenedor.innerHTML += `<p>Venue: ${venue.nombreVenue}</p>`;
            contenedor.innerHTML += `<p>Ubicación: ${venue.ubicacion}</p>`;

            // Botón de editar concierto
            contenedor.innerHTML += `<button class="btn-editar" data-id="${concierto.id}">Editar concierto</button>`;

            // Botón de eliminar concierto
            contenedor.innerHTML += `<button class="btn-eliminar" data-id="${concierto.id}">Eliminar concierto</button>`;

            contenedor.innerHTML += `<hr>`;
        }
    }

    // Delegación de eventos para los botones de editar y eliminar conciertos
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
                    location.reload(); // Recargar la página para reflejar los cambios
                } else {
                    const error = await resEliminar.json();
                    alert("No se pudo eliminar el concierto: " + (error.detail || "Error desconocido"));
                }
            } catch (error) {
                alert("Error al eliminar el concierto: " + error.message);
            }
        }
    });
};