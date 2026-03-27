window.onload = async function() {
    // Cargar venues
    try {
        const res = await fetch("http://127.0.0.1:8000/v1/venues");
        if (!res.ok) throw new Error("Error al cargar venues");
        
        const venues = await res.json();
        const selectVenue = document.getElementById("venue_id");
        
        venues.forEach(venue => {
            const option = document.createElement("option");
            option.value = venue.id;
            option.textContent = `${venue.nombreVenue} - ${venue.ubicacion}`;
            selectVenue.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Error al cargar venues: " + error.message);
    }
};

document.getElementById("formConcierto").onsubmit = async function(e) {
    e.preventDefault();

    const venue_id = document.getElementById("venue_id").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const costoBoleto = document.getElementById("costoBoleto").value.trim();

    if (!venue_id || !fecha || !costoBoleto) {
        alert("Todos los campos son obligatorios");
    if (!fecha || !costoBoleto) {
        alert("Campos faltantes");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/v1/concierto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                venue_id: venue_id,
                fecha: fecha,
                costoBoleto: parseInt(costoBoleto)
                fecha,
                venue_id,
                costoBoleto: parseFloat(costoBoleto)
            })
        });

        if (!res.ok) throw new Error("Error al crear concierto");

        const data = await res.json();
        console.log("Respuesta:", data);

        alert("Concierto creado correctamente");

        localStorage.removeItem("conciertos");

        window.location.href = "conciertos.html";

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
};
