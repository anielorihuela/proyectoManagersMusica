const API_BASE = 'https://proyectomanagersmusica-2.onrender.com/v1';

const formConcierto = document.getElementById('formConcierto');

formConcierto.addEventListener('submit', crearConcierto);

async function crearConcierto(e) {
    e.preventDefault();

    const venueId = document.getElementById('venue_id').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const costoTexto = document.getElementById('costoBoleto').value.trim();

    if (fecha === '' || costoTexto === '') {
        alert('Fecha y costo del boleto son obligatorios.');
        return;
    }

    const costoBoleto = parseInt(costoTexto);

    if (Number.isNaN(costoBoleto) || costoBoleto < 0) {
        alert('El costo del boleto debe ser un número válido.');
        return;
    }

    const nuevoConcierto = {
        fecha: fecha,
        costoBoleto: costoBoleto
    };

    if (venueId !== '') {
        nuevoConcierto.venue_id = venueId;
    }

    try {
        const res = await fetch(`${API_BASE}/concierto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoConcierto)
        });

        const texto = await res.text();

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        alert('Concierto creado correctamente');
        window.location.href = 'conciertos.html?creado=1';

    } catch (error) {
        console.error(error);
        alert(error.message);
    }

}
