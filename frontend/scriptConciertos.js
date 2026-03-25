window.onload = async function conciertos() {
    //1. Buscamos artistas
    const contenedor = document.getElementById('infoConciertos');
    const artistasRes = await fetch('http://127.0.0.1:8000/v1/artistas');
    const artistas = await artistasRes.json();
    let html = '';
    //Para cada artista...
    for(const artista of artistas){
        html = `<h4>${artista.nombreArtista}</h4><br>`;
        let conciertos_ids = artista.conciertos_ids;
        //... Ubicamos sus conciertos
        for(concierto_id of conciertos_ids){
            const conciertoRes = await fetch(`http://127.0.0.1:8000/v1/concierto/${concierto_id}`);
            const concierto = await conciertoRes.json();
            //Cada concierto se asocia a un venue
            const venue_id = concierto.venue_id;
            const venuRes = await fetch(`http://127.0.0.1:8000/v1/venue/${venue_id}`);
            const venue = await venuRes.json();
            //PARA CUALQUIER CAMBIO EN EL HTML, AQUÍ SE HACE
            html += `<p>${concierto.fecha}</p>`;
            html += `<p>${concierto.costoBoleto}</p>`;
            html += `<p>${venue.nombreVenue}</p>`;
            html += `<p>${venue.ubicacion}</p>`;
        }
    }
    contenedor.innerHTML = html;
}