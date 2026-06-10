const { endpoints } = require('./onpe-map');

const ALLOWED_HOSTS = new Set(['resultadosegundavuelta.onpe.gob.pe']);
const RONB_BASE = 'https://api.ronbstudio.com';
const RONB_RESOURCES = new Set(['snapshot', 'proyeccion', 'timeline', 'exterior-paises']);
const UPSTREAM_TIMEOUT_MS = 20000;

function upstreamTimeoutSignal() {
  return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    : undefined;
}

function resolveTarget(query = {}) {
  const key = query.key;
  if (key && endpoints[key]) return { key, target: endpoints[key] };

  const rawUrl = query.url;
  if (rawUrl && typeof rawUrl === 'string') return { key: 'custom', target: rawUrl };

  return null;
}

function createTargetUrl(target) {
  try {
    return new URL(target);
  } catch (error) {
    return null;
  }
}

function isProbablyHtml(contentType, text) {
  const sample = String(text || '').trim().slice(0, 200).toLowerCase();
  return contentType.toLowerCase().includes('text/html') || sample.startsWith('<!doctype') || sample.startsWith('<html');
}

async function fetchOnpe(query = {}) {
  const resolved = resolveTarget(query);

  if (!resolved) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'Falta el parámetro key o url',
        keys: Object.keys(endpoints)
      }
    };
  }

  const target = createTargetUrl(resolved.target);

  if (!target) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'URL inválida para el proxy',
        key: resolved.key,
        target: resolved.target
      }
    };
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return {
      status: 403,
      body: { ok: false, error: 'Host no permitido' }
    };
  }

  const response = await fetch(target.toString(), {
    redirect: 'follow',
    signal: upstreamTimeoutSignal(),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'es-PE,es;q=0.9,en;q=0.8',
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      Origin: 'https://resultadosegundavuelta.onpe.gob.pe',
      Referer: 'https://resultadosegundavuelta.onpe.gob.pe/main/resumen'
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (isProbablyHtml(contentType, text)) {
    return {
      status: 200,
      body: {
        ok: false,
        type: 'UPSTREAM_HTML',
        error: 'ONPE respondió HTML y no JSON. El endpoint público actual parece redirigir a la aplicación web, no al backend de datos.',
        hint: 'La ruta del proxy existe; falta actualizar la URL real de ONPE en onpe-map.js cuando ONPE publique o cambie sus endpoints JSON.',
        key: resolved.key,
        target: target.toString(),
        upstreamStatus: response.status,
        upstreamContentType: contentType,
        sample: text.slice(0, 180)
      }
    };
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    return {
      status: 200,
      body: {
        ok: false,
        type: 'UPSTREAM_NOT_JSON',
        error: 'ONPE respondió contenido que no es JSON.',
        key: resolved.key,
        target: target.toString(),
        upstreamStatus: response.status,
        upstreamContentType: contentType,
        sample: text.slice(0, 180)
      }
    };
  }

  return {
    status: response.status,
    body: json,
    target: target.toString()
  };
}

async function fetchRonb(resource, query = {}) {
  if (!RONB_RESOURCES.has(resource)) {
    return {
      status: 404,
      body: { ok: false, error: 'Recurso RonBStudio no permitido' }
    };
  }

  const target = new URL(`/api/${resource}`, RONB_BASE);
  if (resource === 'timeline' && query.limit) target.searchParams.set('limit', query.limit);

  const response = await fetch(target.toString(), {
    redirect: 'follow',
    signal: upstreamTimeoutSignal(),
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'es-PE,es;q=0.9,en;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      Origin: 'https://www.ronbstudio.com',
      Referer: 'https://www.ronbstudio.com/Portfolio/2026/Elecciones2026/SegundaVuelta/'
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (isProbablyHtml(contentType, text)) {
    return {
      status: 200,
      body: {
        ok: false,
        type: 'UPSTREAM_HTML',
        error: 'RonBStudio respondió HTML y no JSON.',
        target: target.toString(),
        upstreamStatus: response.status,
        upstreamContentType: contentType,
        sample: text.slice(0, 180)
      }
    };
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    return {
      status: 200,
      body: {
        ok: false,
        type: 'UPSTREAM_NOT_JSON',
        error: 'RonBStudio respondió contenido que no es JSON.',
        target: target.toString(),
        upstreamStatus: response.status,
        upstreamContentType: contentType,
        sample: text.slice(0, 180)
      }
    };
  }

  return {
    status: response.status,
    body: json,
    target: target.toString()
  };
}

module.exports = { endpoints, fetchOnpe, fetchRonb };
