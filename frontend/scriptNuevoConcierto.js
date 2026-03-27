document.getElementById("formConcierto").onsubmit = async function(e) {
    e.preventDefault();

    const venue_id = document.getElementById("venue_id").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const costoBoleto = document.getElementById("costoBoleto").value.trim();

    if (!fecha || !costoBoleto) {
        alert("Campos faltantes");
        return;
    }

    try {
        const body = {
            fecha,
            costoBoleto: parseFloat(costoBoleto)
        };
        if (venue_id) body.venue_id = venue_id;

        const res = await fetch("http://127.0.0.1:8000/v1/concierto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("Error al crear concierto");

        const data = await res.json();
        console.log("Respuesta:", data);

        alert("Concierto creado");

        window.location.href = "conciertos.html";

    } catch (error) {
        console.error(error);
        alert("Error en la petición");
    }
};
