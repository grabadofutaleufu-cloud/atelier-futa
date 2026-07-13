# Atelier Futa — Prototipo PWA (sin Glide)

## Qué es esto
Una versión funcional en código de la app, con las 40 matrices reales de tu Excel
(corregí un bug: las columnas Lat/Lon venían sin punto decimal — ej. `-43123` en vez
de `-43.123` — ya está arreglado en los datos incluidos).

Funciona con:
- Mapa propio (SVG, no depende de tiles de internet) con pines por prioridad/estado.
- Contadores en vivo: Total, Listos, Pendientes, Urgentes, No urgentes, % Completado.
- Botón "Nueva Prueba de Estado" (formulario completo: condición, prioridad, foto, notas).
- Botón rápido "🖼️ Marcar grabado aquí" (foto + marca Grabado=true en un toque).
- Vista de Lista, Galería de fotos registradas, y Configuración.
- Guardado 100% local con IndexedDB — anota registros sin señal y no se pierden al cerrar la app.

## Cómo probarla ya mismo
Abre `index.html` directo en el navegador del celular (doble clic o "abrir con Chrome/Safari").
Ya es usable sin instalar nada.

## Cómo instalarla como app (PWA) de verdad
Para que el Service Worker (offline real) y el botón "Agregar a inicio" funcionen,
los 5 archivos deben estar en un hosting con HTTPS. Opciones gratis:
1. **Netlify Drop** (netlify.com/drop) — arrastras la carpeta y en 10 segundos tienes URL pública.
2. **Vercel** o **GitHub Pages** — igual de gratis, requieren cuenta.

Una vez publicada, en el celular: abrir el link → menú del navegador → "Agregar a pantalla de inicio".

## Limitaciones de este prototipo (a resolver en la siguiente vuelta)
- **Un solo dispositivo:** los datos viven en el IndexedDB de ese celular. Si quieres
  que varios artistas vean el mismo estado de las 40 matrices, hace falta un backend
  (recomendado: Supabase, tiene plan gratis con base de datos Postgres real) y lógica
  de sincronización cuando hay señal.
- **Mapa esquemático, no geográfico real:** los pines están ubicados proporcionalmente
  según lat/lon, pero no hay tiles satelitales — evita depender de descargar mapas
  pesados en 3G. Si más adelante quieres el mapa real offline, se puede integrar
  Leaflet + tiles descargados de la zona (MBTiles), pero pesa más y hay que planificarlo.
- **Geolocalización automática:** no está conectada al GPS del dispositivo todavía
  (quedó el campo listo en el formulario). Se agrega con `navigator.geolocation` en
  una próxima iteración, pidiendo permiso la primera vez que se usa.

## Archivos
- `index.html` — la app completa (HTML+CSS+JS, sin dependencias externas).
- `manifest.json` — hace la app instalable.
- `sw.js` — cache offline (Service Worker).
- `icon.svg` — ícono de la app.
