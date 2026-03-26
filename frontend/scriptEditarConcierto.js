const API_BASE = 'http://127.0.0.1:8000/v1';

let conciertoOriginal = null;

window.addEventListener('load', async () => {
    const btnGuardarConcierto = document.getElementById('btnGuardarConcierto');
    const inputVenue = document.getElementById('venue_id');

    btnGuardarConcierto.addEventListener('click', guardarCambiosConcierto);

    inputVenue.addEventListener('blur', async () => {
        const venueId = inputVenue.value.trim();
        await cargarInfoVenue(venueId);
    });

    await cargarConciertoActual();
});

async function cargarConciertoActual() {
    const id = obtenerIdDesdeURL();

    if (!id) {
        mostrarMensaje('No se encontró el ID del concierto en la URL.', 'danger');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/concierto/${id}`);

        if (!res.ok) {
            const texto = await res.text();
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        conciertoOriginal = await res.json();

        document.getElementById('fecha').value = conciertoOriginal.fecha ?? '';
        document.getElementById('venue_id').value = conciertoOriginal.venue_id ?? '';
        document.getElementById('costoBoleto').value = conciertoOriginal.costoBoleto ?? '';
        document.getElementById('estado').value = conciertoOriginal.estado ?? '';

        await cargarInfoVenue(conciertoOriginal.venue_id);

    } catch (error) {
        console.error(error);
        mostrarMensaje('Ese concierto ya no existe en el backend.', 'danger');

        setTimeout(() => {
            window.location.href = 'conciertos.html';
        }, 1800);
    }
}

async function cargarInfoVenue(venueId) {
    const infoVenue = document.getElementById('infoVenue');

    if (!venueId) {
        infoVenue.textContent = '';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/venue/${venueId}`);

        if (!res.ok) {
            infoVenue.textContent = 'No se encontró información del venue.';
            return;
        }

        const venue = await res.json();
        infoVenue.textContent = `Venue actual: ${venue.nombreVenue} | ${venue.ubicacion}`;

    } catch (error) {
        console.error(error);
        infoVenue.textContent = 'No se pudo cargar la información del venue.';
    }
}

async function guardarCambiosConcierto() {
    const id = obtenerIdDesdeURL();

    if (!id) {
        mostrarMensaje('No se encontró el ID del concierto en la URL.', 'danger');
        return;
    }

    if (!conciertoOriginal) {
        mostrarMensaje('No se pudo cargar el concierto antes de editarlo.', 'danger');
        return;
    }

    const metodo = document.getElementById('tipoMetodo').value;

    try {
        let body;

        if (metodo === 'PATCH') {
            body = construirBodyPatch();

            if (Object.keys(body).length === 0) {
                mostrarMensaje('No hay cambios para guardar.', 'warning');
                return;
            }
        } else {
            body = construirBodyPut();
        }

        const res = await fetch(`${API_BASE}/concierto/${id}`, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const texto = await res.text();

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        mostrarMensaje(`Concierto actualizado correctamente con ${metodo}.`, 'success');

        setTimeout(() => {
            window.location.href = 'conciertos.html';
        }, 1000);

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, 'danger');
    }
}

function construirBodyPatch() {
    const body = {};

    const fecha = document.getElementById('fecha').value.trim();
    const venueId = document.getElementById('venue_id').value.trim();
    const costoTexto = document.getElementById('costoBoleto').value.trim();
    const estado = document.getElementById('estado').value.trim();

    if (fecha !== '' && fecha !== (conciertoOriginal.fecha ?? '')) {
        body.fecha = fecha;
    }

    if (venueId !== '' && venueId !== String(conciertoOriginal.venue_id ?? '')) {
        body.venue_id = venueId;
    }

    if (costoTexto !== '') {
        const costoBoleto = parseInt(costoTexto);

        if (Number.isNaN(costoBoleto) || costoBoleto < 0) {
            throw new Error('El costo del boleto debe ser un número válido.');
        }

        if (costoBoleto !== conciertoOriginal.costoBoleto) {
            body.costoBoleto = costoBoleto;
        }
    }

    if (estado !== '' && estado !== (conciertoOriginal.estado ?? '')) {
        body.estado = estado;
    }

    return body;
}

function construirBodyPut() {
    const fecha = document.getElementById('fecha').value.trim();
    const venueId = document.getElementById('venue_id').value.trim();
    const costoTexto = document.getElementById('costoBoleto').value.trim();
    const estado = document.getElementById('estado').value.trim();

    if (fecha === '' || venueId === '' || costoTexto === '' || estado === '') {
        throw new Error('Para PUT debes llenar todos los campos.');
    }

    const costoBoleto = parseInt(costoTexto);

    if (Number.isNaN(costoBoleto) || costoBoleto < 0) {
        throw new Error('El costo del boleto debe ser un número válido.');
    }

    return {
        fecha: fecha,
        venue_id: venueId,
        costoBoleto: String(costoBoleto),
        estado: estado
    };
}

function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function mostrarMensaje(texto, tipo) {
    const mensajeResultado = document.getElementById('mensajeResultado');
    mensajeResultado.style.display = 'block';
    mensajeResultado.className = `alert alert-${tipo} mt-3`;
    mensajeResultado.textContent = texto;
}