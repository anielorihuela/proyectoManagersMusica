window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if(!id){
        alert("No se recibió el id del concierto");
        return;
    }

    try{
        const respuesta = await fetch(`https://proyectomanagersmusica-2.onrender.com/v1/concierto/${id}`);
        const concierto = await respuesta.json();

        document.getElementById("fecha").value = concierto.fecha;
        document.getElementById("venue_id").value = concierto.venue_id;
        document.getElementById("costoBoleto").value = concierto.costoBoleto;
    } catch (error){
        console.log(error);
        alert("Error al cargar el concierto");
    }
};

document.getElementById("btnGuardarConcierto").addEventListener("click", async function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const datosActualizados = {
        fecha: document.getElementById("fecha").value,
        venue_id: document.getElementById("venue_id").value,
        costoBoleto: parseFloat(document.getElementById("costoBoleto").value)
    };

    try {
        const respuesta = await fetch(`https://proyectomanagersmusica-2.onrender.com/v1/concierto/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados)
        });

        if(!respuesta.ok){
            throw new Error("No se pudo actualizar los datos del concierto");
        }

        alert("Concierto actualizado correctamente");
        window.location.href = "conciertos.html";
    } catch(error){
        console.log(error);
        alert("Error al guardar los cambios");
    }
})