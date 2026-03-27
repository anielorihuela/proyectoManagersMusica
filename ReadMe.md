# Managers Música

Aplicación web para la gestión y visualización de artistas, conciertos y estadísticas musicales. Desarrollada como proyecto integrador para el curso COM 11117 - Introducción al Desarrollo Web, primavera 2026.

---

## Descripción del producto

Managers Música es una plataforma dirigida a managers del mundo musical que necesitan tener una vista centralizada de su operación. Desde un solo sitio pueden consultar el catálogo de artistas que representan, los conciertos programados con sus venues y costos de boleto, y acceder a un panel de estadísticas que cruza toda esa información de forma visual.

La aplicación consume una API propia construida con FastAPI que mantiene en memoria los datos de artistas, álbumes, canciones, conciertos y venues. El frontend está construido con HTML, CSS, Bootstrap 5 y JavaScript vanilla, sin ningún framework adicional.

---

## Estructura del proyecto

```
proyectoManagersMusica/
    api/
        main.py
        clases.py
    frontend/
        index.html
        artistas.html
        conciertos.html
        editarArtistas.html
        estadisticas.html
        nuevaCancion.html
        nuevoAlbum.html
        nuevoArtista.html
        nuevoConcierto.html
        scriptIndex.js
        scriptArtistas.js
        scriptConciertos.js
        scriptEditarArtistas.js
        scriptNuevaCancion.js
        scriptNuevoAlbum.js
        scriptNuevoArtista.js
        scriptNuevoConcierto.js
```

La carpeta `api/` contiene todo el backend. La carpeta `frontend/` contiene las páginas y los scripts que las acompañan. Cada página tiene su propio archivo de script para mantener las responsabilidades separadas.

---

## Instrucciones para levantar el backend

Requiere Python 3.10 o superior.

Desde la carpeta `api/`:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

El servidor quedará disponible en `https://proyectomanagersmusica-2.onrender.com`. Para confirmar que está corriendo correctamente, abre en el navegador:

```
https://proyectomanagersmusica-2.onrender.com/v1/artistas
```

Deberías ver un arreglo JSON con los artistas precargados.

El archivo `requirements.txt` contiene:

```
fastapi
uvicorn
pydantic
```

---

## Instrucciones para levantar el frontend

El frontend es un conjunto de archivos estáticos. Puedes abrirlos de dos formas:

**Con Live Server en VS Code:** abre la carpeta `frontend/` en VS Code, haz clic derecho sobre `index.html` y selecciona "Open with Live Server". Asegúrate de que el servidor de FastAPI esté corriendo antes de abrir el frontend, de lo contrario las páginas mostrarán el banner de error de API.

**Con cualquier servidor HTTP local:**

```bash
cd frontend
python -m http.server 5500
```

Luego abre `http://localhost:5500` en el navegador.

El frontend no requiere instalación de dependencias. Todas las bibliotecas externas (Bootstrap, Chart.js, Leaflet) se cargan desde CDN.

---

## Endpoints principales de la API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /v1/artistas | Lista todos los artistas con paginacion |
| GET | /v1/artista/{id} | Obtiene un artista por ID |
| POST | /v1/artista | Crea un nuevo artista |
| PATCH | /v1/artista/{id} | Modifica parcialmente un artista |
| DELETE | /v1/artista/{id} | Elimina un artista |
| GET | /v1/conciertos | Lista todos los conciertos |
| GET | /v1/concierto/{id} | Obtiene un concierto por ID |
| POST | /v1/concierto | Crea un nuevo concierto |
| PATCH | /v1/concierto/{id} | Modifica un concierto |
| PUT | /v1/concierto/{id} | Reemplaza un concierto completo |
| DELETE | /v1/concierto/{id} | Elimina un concierto |
| GET | /v1/venues | Lista todos los venues |
| GET | /v1/venue/{id} | Obtiene un venue por ID |
| GET | /v1/albumes | Lista todos los albumes |
| GET | /v1/album/{id} | Obtiene un album por ID |
| GET | /v1/canciones | Lista todas las canciones |

El health endpoint principal es: `https://proyectomanagersmusica-2.onrender.com/v1/artistas`

---

## Paginas del frontend

**index.html** es el dashboard principal. Muestra tres tarjetas de acceso rapido hacia las secciones de artistas, conciertos y estadisticas.

**artistas.html** muestra la tabla de artistas registrados con sus albumes. Permite editar o eliminar cada artista. El boton de nuevo artista abre el formulario de alta. El conteo en el badge se actualiza dinamicamente con los datos de la API.

**conciertos.html** muestra los conciertos agrupados por artista, con la informacion del venue, fecha y costo de boleto. Permite editar y eliminar conciertos directamente desde la tabla.

**editarArtistas.html** es el formulario de edicion. Recibe el ID del artista por parametro en la URL y pre-llena los campos con los datos actuales. Al guardar hace un PATCH a la API con solo los campos modificados.

**estadisticas.html** es el panel de analisis. Incluye cuatro KPIs en la parte superior, un selector de artistas por chips, tres graficas interactivas con Chart.js, un calendario de gira y un mapa de venues con Leaflet.

---

## Funcionamiento tecnico

### Comunicacion con la API

Todas las paginas consumen la API mediante `fetch`. El manejo de errores distingue entre respuestas exitosas (2xx), errores del cliente (4xx) y errores del servidor (5xx). En caso de fallo, se muestra un mensaje especifico al usuario y, en la pagina de estadisticas, se intenta cargar datos desde el cache local antes de mostrar el estado de error.

### Almacenamiento local

`localStorage` se usa en dos contextos distintos. Primero, para guardar la preferencia de tema claro u oscuro del usuario, que persiste entre todas las sesiones y paginas. Segundo, para cachear la respuesta de la API de artistas en la pagina de estadisticas, con un tiempo de vida de cinco minutos. Si la API no esta disponible pero existe un cache guardado, la pagina muestra ese cache con un aviso visual en lugar de fallar completamente.

### Tema claro y oscuro

Cada pagina tiene un boton en el navbar que alterna entre modo claro y modo oscuro. La seleccion se guarda en `localStorage` con la clave `theme` y se recupera al cargar cada pagina. Las graficas de Chart.js actualizan sus colores de texto, grillas y tooltips automaticamente al cambiar el tema.

### Estadisticas

La pagina de estadisticas carga en paralelo los endpoints de artistas, conciertos, albumes, canciones y venues usando `Promise.all`. Con esos datos construye cuatro elementos visuales. La grafica de barras muestra la popularidad de cada artista. La grafica de dona muestra la distribucion de seguidores. La grafica de linea muestra la cantidad de conciertos por mes en los ultimos seis meses, calculada a partir de las fechas reales de la API. El calendario marca los dias con conciertos programados y muestra el detalle al hacer clic. El mapa de Leaflet coloca un marcador por ciudad, agrupando todos los conciertos que ocurren en la misma ubicacion en un solo popup.

Los chips de artistas permiten filtrar las tres graficas de forma interactiva. Al seleccionar o deseleccionar un artista, las graficas se reconstruyen instantaneamente con el subconjunto seleccionado.

---

## Decisiones de diseno

El color principal de la interfaz es un rosa terroso, `#c98c8c`, que se eligio para diferenciarse de los azules y grises tipicos de los dashboards de gestion. Se queria una identidad visual que tuviera algo de la estetica de la industria musical sin caer en lo generico.

Las tarjetas usan bordes redondeados de 16px y una sombra sutil que se intensifica al hacer hover con un pequeno desplazamiento vertical. Este efecto refuerza la sensacion de que los elementos son objetos con profundidad sin agregar ruido visual.

El modo oscuro no es simplemente un fondo negro. Usa tonos azul marino oscuro para el fondo general y azul petroleo para las tarjetas y contenedores, lo que crea contraste entre capas sin que se sienta plano.

En la pagina de estadisticas se eligio mostrar los chips de seleccion de artistas antes de las graficas porque la interaccion principal de esa pagina es comparar artistas entre si. Ponerlos al inicio hace que el usuario entienda que las graficas responden a su seleccion antes de verlas.

La grafica de linea originalmente simulaba un historial de popularidad inventado. Se decidio cambiarla para mostrar conciertos reales por mes porque esa informacion si existe en la API y tiene mas valor real para un manager que un dato fabricado.

El mapa agrupa conciertos por ciudad en lugar de mostrar un marcador por venue porque la API guarda la ubicacion de los venues como texto libre, no como coordenadas. El agrupamiento por ciudad permite mostrar toda la informacion disponible incluso cuando dos venues distintos estan en la misma ciudad, sin apilar marcadores en el mismo punto.

---

## Autores

| Nombre | Rol |
|--------|-----|
| Aniel | Backend, Python |
| Mario | Frontend Core   |
| Maribel | JavaScript      |
| Oscar | Visualizaciones |