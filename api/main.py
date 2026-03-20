from fastapi import FastAPI, HTTPException, status
from uuid import uuid4, UUID
from clases import *

app = FastAPI()
    
def generar_guid():
    return uuid4()

artistas: dict[UUID, dict] = {}
albumes: dict[UUID, dict] = {}
canciones: dict[UUID, dict] = {}
conciertos: dict[UUID, dict] = {}
venues: dict[UUID, dict] = {}

#POST
@app.post("/v1/artista", 
          response_model=ArtistaRes, 
          status_code=status.HTTP_201_CREATED)
async def create_artista(artista: Artista):
    id_generado = generar_guid()
    artistas[id_generado] = {
        "id" : id_generado,
        "nombreArtista" : artista.nombreArtista,
        "generoArtista" : artista.generoArtista,
        "popularidad" : artista.popularidad,
        "seguidores" : artista.seguidores,
        "conciertos_ids" : artista.conciertos_ids,
        "albumes_ids" : artista.albumes_ids
    }
    return artistas[id_generado]

@app.post("/v1/album", 
          response_model=AlbumRes, 
          status_code=status.HTTP_201_CREATED)
async def create_album(album: Album):
    id_generado = generar_guid()
    albumes[id_generado] = {
        "id" : id_generado,
        "nombreAlbum" : album.nombreAlbum,
        "generoAlbum" : album.generoAlbum,
        "canciones_ids" : album.canciones_ids
    }
    return albumes[id_generado]

@app.post("/v1/cancion", 
          response_model=CancionRes, 
          status_code=status.HTTP_201_CREATED)
async def create_cancion(cancion: Cancion):
    id_generado = generar_guid()
    canciones[id_generado] = {
        "id" : id_generado,
        "nombreCancion" : cancion.nombreCancion,
        "duracionEnSegundos" : cancion.duracionEnSegundos
    }
    return canciones[id_generado]

@app.post("/v1/concierto", 
          response_model=ConciertoRes, 
          status_code=status.HTTP_201_CREATED)
async def create_concierto(concierto: Concierto):
    id_generado = generar_guid()
    conciertos[id_generado] = {
        "id" : id_generado,
        "fecha" : concierto.fecha,
        "venue_id" : concierto.venue_id,
        "costoBoleto" : concierto.costoBoleto,
        "estado" : "programado"
    }
    return conciertos[id_generado]

@app.post("/v1/venue", 
          response_model=VenueRes, 
          status_code=status.HTTP_201_CREATED)
async def create_venue(venue: Venue):
    id_generado = generar_guid()
    venues[id_generado] = {
        "id" : id_generado,
        "nombreVenue" : venue.nombreVenue,
        "ubicacion" : venue.ubicacion,
        "capacidad" : venue.capacidad,
    }
    return venues[id_generado]
  
#GET todos
@app.get("/v1/artistas",
         response_model=list[ArtistaRes])
async def get_artistas():
    return list(artistas.values())

@app.get("/v1/albumes",
         response_model=list[AlbumRes])
async def get_albumes():
    return list(albumes.values())

@app.get("/v1/canciones",
         response_model=list[CancionRes])
async def get_canciones():
    return list(canciones.values())

@app.get("/v1/conciertos",
         response_model=list[ConciertoRes])
async def get_conciertos():
    return list(conciertos.values())

@app.get("/v1/venues",
         response_model=list[VenueRes])
async def get_venues():
    return list(venues.values())

#GET uno
@app.get("/v1/artista/{id_artista}",
         response_model=ArtistaRes)
async def get_artista(id_artista:UUID):
    if id_artista not in artistas:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    artista = artistas[id_artista]
    return artista

@app.get("/v1/cancion/{id_cancion}",
         response_model=CancionRes)
async def get_cancion(id_cancion:UUID):
    if id_cancion not in canciones:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    cancion = canciones[id_cancion]
    return cancion
    
@app.get("/v1/album/{id_album}",
         response_model=AlbumRes)
async def get_album(id_album:UUID):
    if id_album not in albumes:
        raise HTTPException(status_code=404, detail="Albúm no encontrado")
    album = albumes[id_album]
    return album

@app.get("/v1/concierto/{id_concierto}",
         response_model=ConciertoRes)
async def get_concierto(id_concierto:UUID):
    if id_concierto not in conciertos:
        raise HTTPException(status_code=404, detail="Concierto no encontrado")
    concierto = conciertos[id_concierto]
    return concierto

@app.get("/v1/venue/{id_venue}",
         response_model=VenueRes)
async def get_venue(id_venue:UUID):
    if id_venue not in venues:
        raise HTTPException(status_code=404, detail="Venue no encontrado")
    venue = venues[id_venue]
    return venue

#PATCH
@app.patch("/v1/artista/{id_artista}",
           response_model=ArtistaRes)
async def patch_artistas(id_artista:UUID, cambio:ArtistaCambios):
    if id_artista not in artistas:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    artista = artistas[id_artista]
    #solo se cambian los datos que el usuario no haya dejado como None
    if cambio.albumes_ids is not None:
        artista["albumes_ids"] = cambio.albumes_ids
    if cambio.conciertos_ids is not None:
        artista["conciertos_ids"] = cambio.conciertos_ids
    if cambio.generoArtista is not None:
        artista["generoArtista"] = cambio.generoArtista
    if cambio.nombreArtista is not None:
        artista["nombreArtista"] = cambio.nombreArtista
    if cambio.popularidad is not None:
        artista["popularidad"] = cambio.popularidad
    if cambio.seguidores is not None:
        artista["seguidores"] = cambio.seguidores
        
    return artista

@app.patch("/v1/concierto/{id_concierto}",
           response_model=ConciertoRes)
async def patch_concierto(id_concierto:UUID, cambio:ConciertoCambios):
    if id_concierto not in conciertos:
        raise HTTPException(status_code=404, detail="Concierto no encontrado")
    concierto = conciertos[id_concierto]
    
    if cambio.costoBoleto is not None:
        concierto["costoBoleto"] = cambio.costoBoleto
    if cambio.fecha is not None:
        concierto["fecha"] = cambio.fecha
    if cambio.venue_id is not None:
        concierto["venue_id"] = cambio.venue_id
    if cambio.estado is not None:
        concierto["estado"] = cambio.estado
    
    return concierto

@app.patch("/v1/venue/{id_venue}",
           response_model=VenueRes)
async def patch_venue(id_venue:UUID, cambio: VenueCambios):
    if id_venue not in venues:
        raise HTTPException(status_code=404, detail="Venue no encontrado")
    venue = venues[id_venue]
    
    if cambio.capacidad is not None:
        venue["capacidad"] = cambio.capacidad
    if cambio.nombreVenue is not None:
        venue["nombreVenue"] = cambio.nombreVenue
    if cambio.ubicacion is not None:
        venue["ubicacion"] = cambio.ubicacion
    
    return venue

#PUT
@app.put("/v1/concierto/{id_concierto}",
         response_model=ConciertoRes)
async def put_concierto(id_concierto:UUID, cambio:ConciertoPut):
    if id_concierto not in conciertos:
        raise HTTPException(status_code=404, detail="Concierto no encontrado")
    concierto = conciertos[id_concierto]
    concierto["fecha"] = cambio.fecha
    concierto["venue_id"] = cambio.venue_id
    concierto["costoBoleto"] = cambio.costoBoleto
    concierto["estado"] = cambio.estado
    
    return concierto

