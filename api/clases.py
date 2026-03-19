from pydantic import BaseModel
from uuid import UUID

#Clases que regresa la API
class VenueRes(BaseModel):
    id: UUID
    ubicacion: str
    capacidad: int
    nombreVenue: str
    
class ConciertoRes(BaseModel):
    id: UUID
    fecha: str
    venue_id: UUID 
    costoBoleto: int
    estado: str

class CancionRes(BaseModel):
    id: UUID
    nombreCancion: str
    duracionEnSegundos: int
    
class AlbumRes(BaseModel):
    id: UUID
    nombreAlbum: str
    generoAlbum: str
    canciones_ids: list[UUID]  
    
class ArtistaRes(BaseModel):
    id: UUID
    nombreArtista: str
    generoArtista: str
    popularidad: int
    seguidores: int
    conciertos_ids: list[UUID] 
    albumes_ids: list[UUID] 


#Clases que tienen los datos que llena el usuario
class Venue(BaseModel):
    ubicacion: str
    capacidad: int
    nombreVenue: str
    
class Concierto(BaseModel):
    fecha: str
    venue_id: UUID 
    costoBoleto: int

class Cancion(BaseModel):
    nombreCancion: str
    duracionEnSegundos: int
    
class Album(BaseModel):
    nombreAlbum: str
    generoAlbum: str
    canciones_ids: list[UUID]  
    
class Artista(BaseModel):
    nombreArtista: str
    generoArtista: str
    popularidad: int
    seguidores: int
    conciertos_ids: list[UUID]  
    albumes_ids: list[UUID]  
     
#Clases para PATCH
class VenueCambios(BaseModel):
    ubicacion: str | None = None
    capacidad: int | None = None
    nombreVenue: str | None = None
    
class ConciertoCambios(BaseModel):
    fecha: str | None = None
    venue_id: UUID | None = None
    costoBoleto: int | None = None
 
class ArtistaCambios(BaseModel):
    nombreArtista: str | None = None
    generoArtista: str | None = None
    popularidad: int | None = None
    seguidores: int | None = None
    conciertos_ids: list[UUID] | None = None #Podemos añadir varios nuevos conciertos a la vez
    albumes_ids: list[UUID] | None = None #Podemos añadir varios nuevos albumes a la vez