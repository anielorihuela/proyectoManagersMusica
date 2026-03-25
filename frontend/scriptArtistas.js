// artistas.html
window.onload = async function() {
    const contenedor = document.getElementById('infoArtistas');
    
    // 1. trae todos los artistas
    const res = await fetch('http://127.0.0.1:8000/v1/artistas');
    const artistas = await res.json();
    
    // 2. por cada artista busca sus álbumes
    for (const artista of artistas) {
        let htmlArtista = `
            <h2>${artista.nombreArtista}</h2>
            <p>Género: ${artista.generoArtista}</p>
            <p>Popularidad: ${artista.popularidad}</p>
            <p>Seguidores: ${artista.seguidores}</p>
            <h4>Álbumes:</h4>
        `;
        
        // 3. por cada id de álbum hace fetch del álbum
        for (const id_album of artista.albumes_ids) {
            const resAlbum = await fetch(`http://127.0.0.1:8000/v1/album/${id_album}`);
            const album = await resAlbum.json();
            //PARA CUALQUIER CAMBIO EN EL HTML, ES AQUÍ
            htmlArtista += `<p>- ${album.nombreAlbum} (${album.generoAlbum})</p>`;
        }
        htmlArtista += `<button id="${artista.id}">Editar artista</button>`;
        contenedor.innerHTML += htmlArtista + '<hr>';
    }
}
