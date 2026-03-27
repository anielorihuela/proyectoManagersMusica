window.onload = function () {
    const form = document.getElementById("formAlbum");

    form.onsubmit = async function (e) {
        e.preventDefault();

        const nombreAlbum = document.getElementById("nombreAlbum").value;
        const generoAlbum = document.getElementById("generoAlbum").value;
        const cancionesInput = document.getElementById("canciones_ids").value;

        // Validación simple
        if (!nombreAlbum || !generoAlbum) {
            alert("El nombre y género del álbum son obligatorios");
            return;
        }

        // Procesar IDs de canciones (de texto a Array)
        let canciones_ids = [];
        if (cancionesInput.trim()) {
            canciones_ids = cancionesInput
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);
        }

        try {
            // Nota: Verifica si tu endpoint es /v1/album o /v1/albumes (plural)
            const res = await fetch("https://proyectomanagersmusica-2.onrender.com/v1/album", {
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
                const errorData = await res.json();
                throw new Error(errorData.detail || "Error al guardar el álbum");
            }

            const data = await res.json();
            console.log("Álbum creado:", data);

            alert("✅ Álbum creado correctamente");

            // Limpiamos caché para forzar la recarga de datos frescos en el panel
            localStorage.removeItem("albumes");
            localStorage.removeItem("artistas");

            // REDIRECCIÓN: Cambiado de nuevoArtista.html a artistas.html
            window.location.href = "artistas.html";

        } catch (error) {
            console.error(error);
            alert("❌ Error al crear álbum: " + error.message);
        }
    };
};