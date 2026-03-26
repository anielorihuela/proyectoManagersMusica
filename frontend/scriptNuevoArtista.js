window.onload = function () {

    const form = document.getElementById("formArtista");

    form.onsubmit = async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const album = document.getElementById("album").value;
        const cancion = document.getElementById("cancion").value;

        if (!nombre) {
            alert("Campo vacío");
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/v1/artistas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreArtista: nombre,
                    album: album,
                    cancion: cancion
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
            alert("Error al crear artista");
        }
    };
};