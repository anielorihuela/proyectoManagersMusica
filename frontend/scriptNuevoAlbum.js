window.onload = function () {
    const form = document.getElementById("formAlbum");

    form.onsubmit = async function (e) {
        e.preventDefault();

        const nombreAlbum = document.getElementById("nombreAlbum").value;
        const generoAlbum = document.getElementById("generoAlbum").value;
        const cancionesInput = document.getElementById("canciones_ids").value;

        if (!nombreAlbum || !generoAlbum) {
            alert("El nombre y género del álbum son obligatorios");
            return;
        }

        // Procesar IDs de canciones
        let canciones_ids = [];
        if (cancionesInput.trim()) {
            canciones_ids = cancionesInput
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/v1/album", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreAlbum: nombreAlbum,
                    generoAlbum: generoAlbum,
                    canciones_ids: canciones_ids
                })
            });

            if (!res.ok) {
                throw new Error("Error al guardar el álbum");
            }

            const data = await res.json();
            console.log("Álbum creado:", data);

            alert("Álbum creado correctamente");

            localStorage.removeItem("albumes");

            window.location.href = "nuevoArtista.html";

        } catch (error) {
            console.error(error);
            alert("Error al crear álbum: " + error.message);
        }
    };
};
