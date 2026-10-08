# ColdCase

Terminal de entrenamiento del **Cold Case Bureau** del South Angeles Police
Department. Dos divisiones, un solo departamento y siete expedientes sin
resolver desde 1974.

Agente asignado: **Det. Juan Moreno**, placa 1142.

---

## Las dos divisiones

| División | Qué se practica | Actividades |
|---|---|---|
| **Records & Evidence Room** | comandos reales de CMD / MS-DOS | 200 tareas en 7 fases |
| **Data Forensics Desk** | SQL estilo PostgreSQL | 714 diligencias (102 × 7 expedientes) |

La sala de archivo **no resuelve crímenes**: ordena el papel, retira atributos
ocultos y deja la cadena de custodia legible. La mesa de datos **sí** los
resuelve: cada expediente se cierra interrogando la base.

## Qué hay dentro

Ningún framework, ninguna dependencia de ejecución. Todo es JavaScript sin
transpilar sobre un único HTML.

```
index.html          una sola pantalla de terminal para las dos divisiones
shell.js            nucleo comun: pantalla, glifos, sonido, teclado,
                    listas navegables, persistencia y sincronizacion
cmd-fs.js           sistema de archivos virtual de los 7 expedientes
cmd-glossary.js     43 fichas de comandos CMD
cmd-exercises.js    las 200 tareas, en 7 fases
cmd-engine.js       24 comandos CMD con tuberias y redireccion
sql-db.js           esquema de 14 tablas, 240 filas y diagrama E-R
sql-engine.js       motor SQL propio (lexer, parser, evaluador)
sql-glossary.js     30 fichas de clausulas SQL
sql-retos.js        102 plantillas instanciadas sobre los 7 expedientes
sql-app.js          consola psql: metacomandos y validacion por resultado
test/               banco de pruebas en Node, sin navegador
```

### El motor SQL

Escrito a mano: tokenizador, analizador descendente recursivo y evaluador.
Admite `WITH`, `SELECT DISTINCT`, `JOIN` / `LEFT` / `RIGHT` / `FULL` / `CROSS`,
`WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT` / `OFFSET`,
`UNION` / `EXCEPT` / `INTERSECT`, subconsultas escalares, `IN` y `EXISTS`
correlacionadas, subconsultas en el `FROM`, `CASE`, `CAST` / `::`, `||`,
`LIKE` / `ILIKE`, `BETWEEN`, `IS NULL`, agregados y funciones de texto y fecha,
con mensajes de error al estilo PostgreSQL.

Las diligencias **no se validan comparando texto**: se ejecuta la consulta del
analista y su resultado se compara con el de la consulta de referencia. Dos
consultas distintas que devuelven lo mismo cuentan las dos.

### Alineación ASCII

Los caracteres de marco Unicode (`═ ║ █ ►`) no existen en todas las fuentes
monoespaciadas. Cuando el navegador los saca de una fuente de respaldo, su
ancho deja de coincidir con el del texto y las cajas se tuercen.

`shell.js` mide cada glifo al arrancar contra el ancho de una letra y, si
alguno se desvía, dibuja todo en ASCII puro. Se puede forzar con
`marco ascii`, `marco doble` o `marco auto`.

### Sincronización del progreso

El progreso vive en el almacén del artefacto publicado, así que la hoja de
servicio es la misma en cualquier dispositivo donde se abra ColdCase. El
navegador guarda además una copia local para que la pantalla esté completa
antes de que responda la red.

Cuando llegan las dos, **se fusionan sin pérdida**: unión de lo firmado y
máximo del avance. Una tarea firmada en el móvil no la borra el portátil.

Fuera del artefacto (abriendo `index.html` como archivo local) no hay nube: el
juego funciona igual con `localStorage` y el indicador marca `LOCAL`.

## Control por teclado

Todo es operable sin ratón.

| Tecla | Acción |
|---|---|
| `ENTER` | ejecuta la línea o abre la opción marcada |
| `ALT+ENTER` | salto de línea (consultas SQL en varias líneas) |
| `↑` `↓` | historial · en una lista, moverse |
| `TAB` | autocompleta rutas, tablas y columnas |
| `ESC` | cierra la lista o vuelve al menú |
| `CTRL+L` | limpia la pantalla |
| `F1`–`F4` | ayuda, glosario, reto, pista |
| `F5` `F6` | modo investigación · sonido |

El teclado suena: clic de tecla con ruido filtrado en banda, golpe de carro en
`ENTER` y un arpegio reservado al cierre de un caso. Todo sintetizado con
WebAudio, sin un solo archivo de audio.

## Pruebas

```bash
cd test
node full.js      # las 200 tareas y las 714 diligencias, de principio a fin
node cajas.js     # mide cada caja y lista en los dos juegos de marcos
node nube.js      # sincronizacion con un almacen simulado y dos terminales
node local.js     # degradacion a solo localStorage
```

Las pruebas montan un DOM mínimo en Node: no hace falta navegador ni red.

## Licencia

Proyecto personal de entrenamiento. Los siete expedientes, sus víctimas,
sospechosos y laboratorios son ficticios.

---

## Esta copia

Publicada en GitHub Pages: **juanjmorenot.github.io/coldcase/**

Fuera del artefacto de claude.ai no existe `window.claude`, así que esta copia
**no sincroniza**: guarda el progreso solo en el `localStorage` del navegador
que la abre, y el indicador de la barra marca `LOCAL`. La versión con progreso
compartido entre dispositivos es la publicada como artefacto.
