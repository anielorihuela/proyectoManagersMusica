window.onload = function () {

    const form = document.getElementById("formArtista");

    form.onsubmit = async function (e) {
        e.preventDefault();

        const nombreArtista = document.getElementById("nombre").value;
        const generoArtista = document.getElementById("genero").value || "Sin género";
        const popularidad = document.getElementById("popularidad").value ? parseInt(document.getElementById("popularidad").value) : 0;
        const seguidores = document.getElementById("seguidores").value ? parseInt(document.getElementById("seguidores").value) : 0;

        if (!nombreArtista) {
            alert("El nombre del artista es obligatorio");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/v1/artista", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreArtista: nombreArtista,
                    generoArtista: generoArtista,
                    popularidad: popularidad,
                    seguidores: seguidores
                })
            });

            if (!res.ok) {
                throw new Error("Error al guardar");
            }

            alert("Artista creado correctamente");

            localStorage.removeItem("artistas");

            window.location.href = "artistas.html";

        } catch (error) {
            console.error(error);
            alert("Error al crear artista: " + error.message);
        }
    };
};