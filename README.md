# Dashboard Elecciones 2026 ONPE

Versión v5 con proxy corregido para local y Vercel.

## Cómo correrlo en local

No uses doble clic ni Live Server de VS Code, porque eso no ejecuta el backend.

```bash
npm install
npm start
```

Abre:

```txt
http://localhost:3000
```

Pruebas directas:

```txt
http://localhost:3000/api/health
http://localhost:3000/api/test
http://localhost:3000/api/onpe?key=resumenTotales
```

## Lectura de errores

Si `/api/health` responde JSON, el proxy está activo.

Si `/api/test` responde JSON con `success: true`, el proxy funciona y está leyendo la API oficial.

## Buscar fuentes oficiales reales

El dominio `resultados.onpe.gob.pe` puede mostrar Cloudflare/Turnstile. Para capturar las URLs oficiales desde tu propio navegador:

```bash
npm run discover:onpe
```

Se abrirá Chrome. Si aparece Cloudflare, resuélvelo manualmente. El script guardará las peticiones interesantes en:

```txt
onpe-discovered.json
```

Con una URL JSON oficial encontrada ahí, actualiza `onpe-map.js`.

Los errores `chrome-extension://...`, `ActionableCoachmark`, `showOneChild` no son del proyecto. Provienen de extensiones del navegador. Para probar limpio, usa modo incógnito sin extensiones.

## Estructura de APIs

Las rutas están centralizadas en `onpe-map.js` y `proxy-core.js`.

El frontend llama a:

```txt
/api/onpe?key=resumenTotales
```

El backend llama internamente a ONPE.

## Deploy en Vercel

El proyecto incluye `vercel.json` para servir el frontend y las rutas serverless de `/api`.

Deploy manual:

```bash
npm run deploy
```

Deploy a produccion:

```bash
npm run deploy:prod
```

## Auto-deploy en Vercel

Opcion recomendada: conecta este repositorio en Vercel. Cada push a `main` se desplegara automaticamente.

Opcion con GitHub Actions: el workflow `.github/workflows/vercel-production.yml` despliega a produccion cuando haces push a `main` o cuando lo ejecutas manualmente.

Configura estos secrets en GitHub:

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Puedes obtener `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` ejecutando una vez:

```bash
npx vercel link
```

Luego revisa `.vercel/project.json`. No subas la carpeta `.vercel` al repositorio.
