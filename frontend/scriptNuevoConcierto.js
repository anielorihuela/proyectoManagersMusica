document.getElementById("formConcierto").onsubmit = async function(e) {
    e.preventDefault();

    const lugar = document.getElementById("lugar").value.trim();
    const fecha = document.getElementById("fecha").value.trim();

    if (!lugar || !fecha) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:3000/conciertos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lugar, fecha })
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
