const btnGuardar = document.getElementById('btnGuardar');
btnGuardar.addEventListener('click',guardar_cambios);

async function guardar_cambios() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const cambios = {
        //se usó IA para esta parte del código porque estaba teniendo conflictos
        //con el main.py y no entendía cómo solucionarlo
        nombreArtista: document.getElementById('nombreArtista').value || null,
        generoArtista: document.getElementById('generoArtista').value || null,
        popularidad: document.getElementById('popularidad').value 
            ? parseInt(document.getElementById('popularidad').value) 
            : null,
        seguidores: document.getElementById('seguidores').value 
            ? parseInt(document.getElementById('seguidores').value) 
            : null,
        conciertos_ids: document.getElementById('conciertos_ids').value
            ? document.getElementById('conciertos_ids').value.split(',').map(id => id.trim()).filter(id => id !== '')
            : null,
        albumes_ids: document.getElementById('albumes_ids').value
            ? document.getElementById('albumes_ids').value.split(',').map(id => id.trim()).filter(id => id !== '')
            : null
    };
    
    await fetch(`http://127.0.0.1:8000/v1/artista/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios)
    });
}