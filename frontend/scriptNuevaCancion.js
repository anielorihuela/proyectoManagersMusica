const API_BASE = 'https://proyectomanagersmusica-2.onrender.com/v1';

const btnCrearCancion = document.getElementById('btnCrearCancion');
const mensajeResultado = document.getElementById('mensajeResultado');

// Usamos el evento del formulario si existe, o mantenemos el click
btnCrearCancion.addEventListener('click', crearCancion);

async function crearCancion() {
    const nombreCancion = document.getElementById('nombreCancion').value.trim();
    const duracionTexto = document.getElementById('duracionEnSegundos').value.trim();

    if (nombreCancion === '' || duracionTexto === '') {
        mostrarMensaje('Completa todos los campos.', 'danger');
        return;
    }

    const duracionEnSegundos = parseInt(duracionTexto);

    if (Number.isNaN(duracionEnSegundos) || duracionEnSegundos <= 0) {
        mostrarMensaje('La duración debe ser un número mayor que cero.', 'danger');
        return;
    }

    const nuevaCancion = {
        nombreCancion: nombreCancion,
        duracionEnSegundos: duracionEnSegundos
    };

    try {
        // Desactivar botón para evitar múltiples clics
        btnCrearCancion.disabled = true;
        btnCrearCancion.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';

        const res = await fetch(`${API_BASE}/cancion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCancion)
        });

        if (!res.ok) {
            const texto = await res.text();
            throw new Error(`Error ${res.status}: ${texto}`);
        }

        mostrarMensaje('✅ Canción creada correctamente. Redirigiendo...', 'success');

        // Limpiar caché local para que el panel principal pida los datos nuevos
        localStorage.removeItem('artistas');
        localStorage.removeItem('albumes');

        // Esperar 1.5 segundos antes de volver para que el usuario vea el éxito
        setTimeout(() => {
            window.location.href = 'artistas.html';
        }, 1500);

    } catch (error) {
        console.error(error);
        mostrarMensaje('❌ ' + error.message, 'danger');
        
        // Reactivar botón si hubo error
        btnCrearCancion.disabled = false;
        btnCrearCancion.textContent = 'Crear canción';
    }
}

function mostrarMensaje(texto, tipo) {
    mensajeResultado.style.display = 'block';
    mensajeResultado.className = `alert alert-${tipo} mt-3 shadow-sm`;
    mensajeResultado.textContent = texto;
}