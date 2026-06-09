const API_BASE = 'https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend';
const ASSETS_BASE = 'https://resultadosegundavuelta.onpe.gob.pe/assets';

const endpoints = {
  procesoActivo: '/proceso/proceso-electoral-activo',
  elecciones: '/proceso/3/elecciones',
  resumenTotales: '/resumen-general/totales?idEleccion=10&tipoFiltro=eleccion',
  resumenParticipantes: '/resumen-general/participantes?idEleccion=10&tipoFiltro=eleccion',
  presidencialPorUbicacion: '/eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion',
  mesasTotales: '/mesa/totales?tipoFiltro=eleccion',
  mapaCalor: '/resumen-general/mapa-calor?idEleccion=10&tipoFiltro=total',
  departamentos: '/ubigeos/departamentos?idEleccion=10&idAmbitoGeografico=1',
  mesasAmbito: '/mesa/totales?tipoFiltro=ambito_geografico&listRegiones=TODOS,PER%C3%9A,EXTRANJERO&ambitoGeografico=1',
  presidencialPorAmbito: '/eleccion-presidencial/participantes-ubicacion-geografica-nombre?tipoFiltro=ambito_geografico&idAmbitoGeografico=1&listRegiones=TODOS,PER%C3%9A,EXTRANJERO&idEleccion=10',
  resumenTotalesAmbito: '/resumen-general/totales?idAmbitoGeografico=1&idEleccion=10&tipoFiltro=ambito_geografico',
  mapaCalorAmbito: '/resumen-general/mapa-calor?idAmbitoGeografico=1&idEleccion=10&tipoFiltro=ambito_geografico',
  continentesExterior: '/ubigeos/departamentos?idEleccion=10&idAmbitoGeografico=2',
  mapaCalorExterior: '/resumen-general/mapa-calor?idAmbitoGeografico=2&idEleccion=10&tipoFiltro=ambito_geografico',
  presidencialExterior: '/eleccion-presidencial/participantes-ubicacion-geografica-nombre?tipoFiltro=ambito_geografico&idAmbitoGeografico=2&listRegiones=TODOS&idEleccion=10',
  mesasExterior: '/mesa/totales?tipoFiltro=ambito_geografico&listRegiones=TODOS&ambitoGeografico=2',
  presidencialPorOrganizacion: '/eleccion-presidencial/participantes-organizacion-politica?idEleccion=10&tipoFiltro=eleccion'
};

const assetEndpoints = {
  geodataPeru: '/lib/amcharts5/geodata/json/peruLow.json',
  geodataContinental: '/lib/amcharts5/geodata/json/continental_total.json'
};

const API_URLS = Object.fromEntries(
  Object.entries(endpoints).map(([key, path]) => [key, `${API_BASE}${path}`])
);

const ASSET_URLS = Object.fromEntries(
  Object.entries(assetEndpoints).map(([key, path]) => [key, `${ASSETS_BASE}${path}`])
);

const REFRESH_SECONDS = 120;
const candidatePhotos = {
  'KEIKO SOFIA FUJIMORI HIGUCHI': 'https://mpesije.jne.gob.pe/apidocs/251cd1c0-acc7-4338-bd8a-439ccb9238d0.jpeg',
  'ROBERTO HELBERT SANCHEZ PALOMINO': 'https://resultadosegundavuelta.onpe.gob.pe/assets/img-reales/candidatos/16002918.png'
};

const candidatePhotoFallbacks = {
  'ROBERTO HELBERT SANCHEZ PALOMINO': 'https://mpesije.jne.gob.pe/apidocs/bb7c7465-9c6e-44eb-ac7d-e6cc7f872a1a.jpg'
};

const partyAssets = {
  'FUERZA POPULAR': {
    logo: 'https://fuerzapopular.com.pe/wp-content/uploads/2023/09/LOGO-FP-1.png',
    side: 'left'
  },
  'JUNTOS POR EL PERU': {
    logo: 'https://jp.org.pe/wp-content/uploads/2024/04/cropped-cropped-logo_jp-1.png',
    side: 'right'
  }
};

const countryFlags = {
  ALEMANIA: '🇩🇪', ARGENTINA: '🇦🇷', AUSTRIA: '🇦🇹', BÉLGICA: '🇧🇪', BELGICA: '🇧🇪', BOLIVIA: '🇧🇴', BRASIL: '🇧🇷', CANADA: '🇨🇦', CANADÁ: '🇨🇦', CHILE: '🇨🇱', COLOMBIA: '🇨🇴', 'COSTA RICA': '🇨🇷', CUBA: '🇨🇺', ECUADOR: '🇪🇨', 'EL SALVADOR': '🇸🇻', ESPAÑA: '🇪🇸', ESPANA: '🇪🇸', 'ESTADOS UNIDOS DE AMERICA': '🇺🇸', 'ESTADOS UNIDOS DE ÁMERICA': '🇺🇸', FRANCIA: '🇫🇷', HOLANDA: '🇳🇱', HONDURAS: '🇭🇳', HUNGRIA: '🇭🇺', HUNGRÍA: '🇭🇺', IRLANDA: '🇮🇪', ITALIA: '🇮🇹', JAPON: '🇯🇵', JAPÓN: '🇯🇵', MEXICO: '🇲🇽', MÉXICO: '🇲🇽', NICARAGUA: '🇳🇮', NORUEGA: '🇳🇴', PANAMA: '🇵🇦', PANAMÁ: '🇵🇦', PARAGUAY: '🇵🇾', PORTUGAL: '🇵🇹', 'REPUBLICA DOMINICANA': '🇩🇴', 'REPÚBLICA DOMINICANA': '🇩🇴', SUIZA: '🇨🇭', URUGUAY: '🇺🇾', VENEZUELA: '🇻🇪'
};

const countryIso = {
  ALEMANIA: 'de', ARGENTINA: 'ar', AUSTRIA: 'at', BÉLGICA: 'be', BELGICA: 'be', BOLIVIA: 'bo', BRASIL: 'br', CANADA: 'ca', CANADÁ: 'ca', CHILE: 'cl', COLOMBIA: 'co', 'COSTA RICA': 'cr', CUBA: 'cu', ECUADOR: 'ec', 'EL SALVADOR': 'sv', ESPAÑA: 'es', ESPANA: 'es', 'ESTADOS UNIDOS DE AMERICA': 'us', 'ESTADOS UNIDOS DE ÁMERICA': 'us', FRANCIA: 'fr', HOLANDA: 'nl', HONDURAS: 'hn', HUNGRIA: 'hu', HUNGRÍA: 'hu', IRLANDA: 'ie', ITALIA: 'it', JAPON: 'jp', JAPÓN: 'jp', MEXICO: 'mx', MÉXICO: 'mx', NICARAGUA: 'ni', NORUEGA: 'no', PANAMA: 'pa', PANAMÁ: 'pa', PARAGUAY: 'py', PORTUGAL: 'pt', 'REPUBLICA DOMINICANA': 'do', 'REPÚBLICA DOMINICANA': 'do', SUIZA: 'ch', URUGUAY: 'uy', VENEZUELA: 've', FINLANDIA: 'fi', GRECIA: 'gr', GUATEMALA: 'gt', 'GRAN BRETAÑA': 'gb', 'GRAN DUCADO DE LUXEMBURGO': 'lu', LUXEMBURGO: 'lu', DINAMARCA: 'dk', MALTA: 'mt', POLONIA: 'pl', SUECIA: 'se', 'REPÚBLICA CHECA': 'cz', 'REPUBLICA CHECA': 'cz', ISRAEL: 'il', INDIA: 'in', CHINA: 'cn', JAPÓN: 'jp', TURQUÍA: 'tr', TURQUIA: 'tr', 'TRINIDAD Y TOBAGO': 'tt', SUDAFRICA: 'za', SUDÁFRICA: 'za'
};

const regionIdByName = {
  AMAZONAS: 'PE-AMA',
  ÁNCASH: 'PE-ANC',
  ANCASH: 'PE-ANC',
  APURÍMAC: 'PE-APU',
  APURIMAC: 'PE-APU',
  AREQUIPA: 'PE-ARE',
  AYACUCHO: 'PE-AYA',
  CAJAMARCA: 'PE-CAJ',
  CALLAO: 'PE-CAL',
  CUSCO: 'PE-CUS',
  HUANCAVELICA: 'PE-HUV',
  HUÁNUCO: 'PE-HUC',
  HUANUCO: 'PE-HUC',
  ICA: 'PE-ICA',
  JUNÍN: 'PE-JUN',
  JUNIN: 'PE-JUN',
  'LA LIBERTAD': 'PE-LAL',
  LAMBAYEQUE: 'PE-LAM',
  LIMA: 'PE-LIM',
  LORETO: 'PE-LOR',
  'MADRE DE DIOS': 'PE-MDD',
  MOQUEGUA: 'PE-MOQ',
  PASCO: 'PE-PAS',
  PIURA: 'PE-PIU',
  PUNO: 'PE-PUN',
  'SAN MARTÍN': 'PE-SAM',
  'SAN MARTIN': 'PE-SAM',
  TACNA: 'PE-TAC',
  TUMBES: 'PE-TUM',
  UCAYALI: 'PE-UCA'
};

function canUseProxy() {
  return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

function proxiedUrl(name, url) {
  if (!canUseProxy()) return url;
  // Se usa key para que el backend arme la URL y no haya problemas con URLs codificadas.
  return `/api/onpe?key=${encodeURIComponent(name)}`;
}

const fallback = {
  totals: { 
    procesadas: 95.8, 
    contabilizadasPct: 95.8, 
    actasProcesadas: 95.8,
    actasContabilizadas: 95.8,
    porcentajeActasProcesadas: 95.8,
    porcentajeActasContabilizadas: 95.8,
    participacion: 69.7, 
    participacionCiudadana: 69.7,
    votosValidos: 17797736, 
    totalVotosValidos: 17797736,
    totalVotosEmitidos: 18790210,
    totalActas: 87041,
    contabilizadas: 83385,
    mesasProcesadas: 95.8, 
    mesasContabilizadas: 95.8 
  },
  participants: [
    { nombre: "Keiko Fujimori", organizacion: "FUERZA POPULAR", votos: 8890401, porcentaje: 49.94 },
    { nombre: "Roberto Sánchez", organizacion: "JUNTOS POR EL PERU", votos: 8910295, porcentaje: 50.06 }
  ],
  locations: [
    { ubicacion: "Lima", ganador: "Keiko Fujimori", votos: 2840000, porcentaje: 52.1 },
    { ubicacion: "La Libertad", ganador: "Roberto Sánchez", votos: 890000, porcentaje: 48.9 },
    { ubicacion: "Piura", ganador: "Keiko Fujimori", votos: 620000, porcentaje: 51.3 }
  ],
  territories: [
    { name: 'Exterior (Real · Datum)', actasJee: 0, estimatedVotes: 0, net: 0, pendingNet: 50881 },
    { name: 'Lima', actasJee: 914, estimatedVotes: 201107, net: 43786, pendingNet: 43785 },
    { name: 'Callao', actasJee: 69, estimatedVotes: 14649, net: 3544, pendingNet: 3545 },
    { name: 'Piura', actasJee: 65, estimatedVotes: 13224, net: 1983, pendingNet: 1928 },
    { name: 'Cusco', actasJee: 47, estimatedVotes: 9138, net: -5073, pendingNet: -31957 },
    { name: 'Áncash', actasJee: 45, estimatedVotes: 8167, net: -1761, pendingNet: -1761 },
    { name: 'La Libertad', actasJee: 36, estimatedVotes: 7301, net: 1449, pendingNet: 1449 },
    { name: 'Ucayali', actasJee: 36, estimatedVotes: 5974, net: -41, pendingNet: -173 },
    { name: 'Junín', actasJee: 32, estimatedVotes: 6069, net: -884, pendingNet: -883 },
    { name: 'Loreto', actasJee: 32, estimatedVotes: 4997, net: 287, pendingNet: -6304 },
    { name: 'Cajamarca', actasJee: 31, estimatedVotes: 5345, net: -1939, pendingNet: -1939 },
    { name: 'Arequipa', actasJee: 25, estimatedVotes: 5331, net: -1816, pendingNet: -1815 },
    { name: 'Puno', actasJee: 24, estimatedVotes: 5299, net: -3829, pendingNet: -3829 },
    { name: 'Ica', actasJee: 22, estimatedVotes: 4933, net: 167, pendingNet: 167 },
    { name: 'Huánuco', actasJee: 20, estimatedVotes: 3470, net: -1217, pendingNet: -1217 },
    { name: 'Tumbes', actasJee: 18, estimatedVotes: 2910, net: 177, pendingNet: 177 },
    { name: 'Lambayeque', actasJee: 17, estimatedVotes: 3008, net: 418, pendingNet: 418 },
    { name: 'Moquegua', actasJee: 14, estimatedVotes: 2410, net: -192, pendingNet: -192 },
    { name: 'Amazonas', actasJee: 13, estimatedVotes: 2204, net: -263, pendingNet: -263 },
    { name: 'Madre de Dios', actasJee: 12, estimatedVotes: 2010, net: -391, pendingNet: -391 },
    { name: 'San Martín', actasJee: 11, estimatedVotes: 1890, net: -460, pendingNet: -460 },
    { name: 'Pasco', actasJee: 10, estimatedVotes: 1710, net: -568, pendingNet: -568 },
    { name: 'Huancavelica', actasJee: 9, estimatedVotes: 1560, net: -1224, pendingNet: -1224 },
    { name: 'Tacna', actasJee: 8, estimatedVotes: 1420, net: -1234, pendingNet: -1234 },
    { name: 'Apurímac', actasJee: 7, estimatedVotes: 1260, net: -1260, pendingNet: -1260 },
    { name: 'Ayacucho', actasJee: 6, estimatedVotes: 1100, net: -1645, pendingNet: -1645 }
  ],
  worldRows: [
    { continent: 'América', country: 'Estados Unidos de America', avance: 53, validVotes: 32873, keikoPct: 77.8, sanchezPct: 22.2 },
    { continent: 'América', country: 'Argentina', avance: 21, validVotes: 11619, keikoPct: 58.6, sanchezPct: 41.4 },
    { continent: 'Europa', country: 'Italia', avance: 24, validVotes: 11024, keikoPct: 48.7, sanchezPct: 51.3 },
    { continent: 'América', country: 'Chile', avance: 11, validVotes: 8146, keikoPct: 51.1, sanchezPct: 48.9 },
    { continent: 'Europa', country: 'España', avance: 18, validVotes: 7920, keikoPct: 49.2, sanchezPct: 50.8 }
  ]
};

const state = {
  raw: {},
  api: {},
  participants: [],
  locations: [],
  chart: null,
  projectionChart: null,
  map: null,
  mapPopup: null,
  mapReady: false,
  mapLayerReady: false,
  rankingMode: false,
  participationScope: 'peru',
  worldRows: [],
  refreshTimer: null,
  nextRefreshAt: null,
  ronbProjection: null,
  ronbExterior: null,
  loading: false
};

const qs = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('es-PE');
const pct = (n) => `${Number(n || 0).toFixed(2)}%`;
const pct3 = (n) => `${Number(n || 0).toFixed(3)}%`;

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const cleaned = String(value).replace('%', '').replace(/,/g, '').trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function deepFind(obj, keys) {
  const lowerKeys = keys.map(k => k.toLowerCase());
  const seen = new Set();

  function scan(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return undefined;
    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = scan(item);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    for (const [k, v] of Object.entries(value)) {
      const lk = k.toLowerCase();
      if (lowerKeys.some(key => lk === key || lk.includes(key)) && typeof v !== 'object') return v;
    }

    for (const v of Object.values(value)) {
      const found = scan(v);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  return scan(obj);
}

function findArrays(obj) {
  const arrays = [];
  const seen = new Set();

  function scan(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value)) {
      if (value.length && typeof value[0] === 'object') arrays.push(value);
      value.forEach(scan);
      return;
    }
    Object.values(value).forEach(scan);
  }

  scan(obj);
  return arrays;
}

async function getJson(name, url) {
  const row = document.querySelector(`[data-api="${name}"] .api-state`);
  const requestUrl = proxiedUrl(name, url);

  try {
    if (row) row.textContent = 'Cargando vía proxy...';

    if (!canUseProxy()) {
      throw new Error('Abre el proyecto con npm start o publícalo en Vercel');
    }

    const res = await fetch(requestUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (contentType.includes('text/html') || text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      throw new Error('La ruta /api/onpe devolvió HTML. Revisa /api/health; si funciona, ONPE cambió o cerró ese endpoint JSON.');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Respuesta no JSON: ${text.slice(0, 120)}`);
    }

    if (data?.ok === false && data?.type?.startsWith('UPSTREAM_')) {
      state.api[name] = data.type;
      if (row) row.textContent = 'ONPE no disponible; usando respaldo';
      return null;
    }

    if (!res.ok || data?.ok === false) {
      const msg = data?.type === 'UPSTREAM_HTML'
        ? 'Endpoint JSON de ONPE no disponible actualmente'
        : data?.error || `HTTP ${res.status}`;
      const tipo = data?.type ? ` [${data.type}]` : '';
      throw new Error(`${msg}${tipo}`);
    }
    state.api[name] = 'OK';
    if (row) row.textContent = 'Conectado vía proxy';
    return data;
  } catch (error) {
    state.api[name] = error.message;
    if (row) row.textContent = `Error: ${error.message}`;
    if (!error.message.includes('Endpoint JSON de ONPE no disponible')) console.warn(`No se pudo cargar ${name}`, error);
    return null;
  }
}

async function getOnpeUrl(path) {
  const target = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(`/api/onpe?url=${encodeURIComponent(target)}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  const data = await res.json();
  if (data?.ok === false && data?.type?.startsWith('UPSTREAM_')) return null;
  if (!res.ok || data?.ok === false) throw new Error(`ONPE ${res.status}: ${target}`);
  return data;
}

async function getRonb(resource, query = '') {
  if (!canUseProxy()) return null;
  const suffix = query ? `?${query}` : '';
  const res = await fetch(`/api/ronb/${encodeURIComponent(resource)}${suffix}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  const data = await res.json();
  if (data?.ok === false && data?.type?.startsWith('UPSTREAM_')) return null;
  if (!res.ok || data?.ok === false) return null;
  return data;
}

function ronbTotals(national = {}) {
  return {
    porcentajeActasProcesadas: toNumber(national.pct_actas),
    porcentajeActasContabilizadas: toNumber(national.pct_actas),
    actasProcesadas: toNumber(national.pct_actas),
    actasContabilizadas: toNumber(national.pct_actas),
    participacionCiudadana: toNumber(national.participacion),
    totalVotosValidos: toNumber(national.votos_validos),
    totalVotosEmitidos: toNumber(national.votos_emitidos),
    totalActas: toNumber(national.actas_total),
    contabilizadas: toNumber(national.actas_contabilizadas),
    enviadasJee: toNumber(national.actas_enviadas_jee),
    pendientesJee: toNumber(national.actas_pendientes_jee)
  };
}

function ronbParticipants(snapshot = {}) {
  const candidates = snapshot.national?.candidatos || {};
  return [
    {
      nombre: candidates.A?.nombre || 'Keiko Fujimori',
      organizacion: candidates.A?.partido || 'FUERZA POPULAR',
      votos: toNumber(candidates.A?.votos),
      porcentaje: toNumber(candidates.A?.pct)
    },
    {
      nombre: candidates.B?.nombre || 'Roberto Sánchez',
      organizacion: candidates.B?.partido || 'JUNTOS POR EL PERU',
      votos: toNumber(candidates.B?.votos),
      porcentaje: toNumber(candidates.B?.pct)
    }
  ];
}

function ronbDepartments(snapshot = {}) {
  return (snapshot.regiones || []).filter(row => String(row.ubigeo || '') !== '__exterior__');
}

function ronbDepartmentRows(snapshot = {}) {
  return ronbDepartments(snapshot).map(row => ({
    ubicacion: row.nombre,
    ganador: toNumber(row.pct_actas) >= 99 ? 'Casi completo' : toNumber(row.pct_actas) >= 95 ? 'Alto avance' : 'En conteo',
    votos: toNumber(row.actas_contabilizadas),
    porcentaje: toNumber(row.pct_actas)
  })).sort((a, b) => b.porcentaje - a.porcentaje || b.votos - a.votos);
}

function ronbDepartmentRefs(snapshot = {}) {
  return ronbDepartments(snapshot).map(row => ({ nombre: row.nombre, ubigeo: row.ubigeo }));
}

function ronbHeatRows(snapshot = {}) {
  return ronbDepartments(snapshot).map(row => ({
    ubigeoNivel01: row.ubigeo,
    porcentajeActasContabilizadas: toNumber(row.pct_actas),
    actasContabilizadas: toNumber(row.actas_contabilizadas)
  }));
}

function ronbTotalsByScope(snapshot = {}) {
  const national = snapshot.national || {};
  const exterior = (snapshot.regiones || []).find(row => String(row.ubigeo || '') === '__exterior__');
  return [
    { nombre: 'PERU', ...ronbTotals(national) },
    exterior ? { nombre: 'EXTRANJERO', ...ronbTotals(exterior) } : null
  ].filter(Boolean);
}

function ronbExteriorParticipants(snapshot = {}) {
  const exterior = (snapshot.regiones || []).find(row => String(row.ubigeo || '') === '__exterior__');
  if (!exterior) return null;
  return {
    data: [
      { nombreCandidato: exterior.candidatos?.A?.nombre || 'Keiko Fujimori', organizacionPolitica: exterior.candidatos?.A?.partido || 'FUERZA POPULAR', votos: toNumber(exterior.candidatos?.A?.votos), porcentaje: toNumber(exterior.candidatos?.A?.pct) },
      { nombreCandidato: exterior.candidatos?.B?.nombre || 'Roberto Sánchez', organizacionPolitica: exterior.candidatos?.B?.partido || 'JUNTOS POR EL PERU', votos: toNumber(exterior.candidatos?.B?.votos), porcentaje: toNumber(exterior.candidatos?.B?.pct) }
    ]
  };
}

function ronbTerritoryRows(snapshot = {}, projection = {}) {
  const projectedByName = new Map((projection.por_departamento || []).map(row => [normalizeText(row.dept || ''), row]));
  return (snapshot.regiones || []).map(row => {
    const isExterior = String(row.ubigeo || '') === '__exterior__';
    const projected = projectedByName.get(isExterior ? 'EXTERIOR' : normalizeText(row.nombre || '')) || {};
    const validVotes = toNumber(row.votos_validos) || toNumber(row.candidatos?.A?.votos) + toNumber(row.candidatos?.B?.votos);
    const net = toNumber(row.candidatos?.A?.votos) - toNumber(row.candidatos?.B?.votos);
    return {
      name: isExterior ? (projection.ext_label || 'Exterior (Real · Datum)') : row.nombre,
      actasContabilizadasPct: toNumber(row.pct_actas),
      actasContabilizadas: toNumber(row.actas_contabilizadas),
      totalActas: toNumber(row.actas_total),
      actasJee: toNumber(row.actas_enviadas_jee),
      actasPendientesJee: toNumber(row.actas_pendientes_jee),
      validVotes,
      keikoVotes: toNumber(row.candidatos?.A?.votos),
      sanchezVotes: toNumber(row.candidatos?.B?.votos),
      margin: validVotes ? net / validVotes : 0,
      pendingNet: Math.round(toNumber(projected.addK) - toNumber(projected.addS))
    };
  });
}

function ronbWorldRows(exterior = {}) {
  return (exterior.continentes || []).flatMap(continent => (continent.paises || [])
    .filter(country => toNumber(country.val) > 0)
    .map(country => {
      const total = Math.max(toNumber(country.val), toNumber(country.keiko) + toNumber(country.sanchez), 1);
      return {
        continent: continent.nombre,
        country: country.abbr,
        iso: country.iso,
        avance: toNumber(country.at) ? (toNumber(country.ac) / toNumber(country.at)) * 100 : 0,
        validVotes: total,
        keikoVotes: toNumber(country.keiko),
        sanchezVotes: toNumber(country.sanchez),
        keikoPct: (toNumber(country.keiko) / total) * 100,
        sanchezPct: (toNumber(country.sanchez) / total) * 100
      };
    })).sort((a, b) => b.validVotes - a.validVotes);
}

function setupApiList() {
  const apiList = qs('apiList');
  if (!apiList) return;
  const apiEntries = { ...API_URLS, ...ASSET_URLS };
  apiList.innerHTML = Object.entries(apiEntries).map(([key, url]) => `
    <div class="api-item" data-api="${key}">
      <strong>${key}</strong>
      <code>${url}</code>
      <small>Proxy: <code>/api/onpe?key=${key}</code>. Estado: <code>/api/health</code>. Prueba ONPE: <code>/api/test</code>.</small>
      <div class="api-state">Pendiente</div>
    </div>
  `).join('');
}

function normalizeTotals(raw, mesasRaw = {}) {
  const totals = {
    procesadas: toNumber(deepFind(raw, ['porcentajeActasProcesadas', 'actasProcesadas', 'procesadas', 'porcActasProcesadas', 'avanceProcesadas'])),
    contabilizadas: toNumber(deepFind(raw, ['porcentajeActasContabilizadas', 'actasContabilizadas', 'contabilizadasPct', 'porcActasContabilizadas', 'avanceContabilizadas'])),
    participacion: toNumber(deepFind(raw, ['participacionCiudadana', 'porcentajeParticipacion', 'participacion', 'porcParticipacion'])),
    votosValidos: toNumber(deepFind(raw, ['votosValidos', 'totalVotosValidos', 'validos', 'totalValidos'])),
    mesasProcesadas: toNumber(deepFind(mesasRaw, ['mesasProcesadas', 'procesadas', 'totalProcesadas'])),
    mesasContabilizadas: toNumber(deepFind(mesasRaw, ['mesasContabilizadas', 'contabilizadas', 'totalContabilizadas']))
  };

  if (!totals.procesadas) totals.procesadas = totals.contabilizadas;
  if (!totals.procesadas && totals.mesasProcesadas) totals.procesadas = totals.mesasProcesadas;
  if (!totals.contabilizadas && totals.mesasContabilizadas) totals.contabilizadas = totals.mesasContabilizadas;
  return totals;
}

function normalizeParticipants(...rawSources) {
  const allItems = [];

  rawSources.filter(Boolean).forEach(raw => {
    const arrays = findArrays(raw);
    const likelyArrays = arrays.filter(arr => arr.some(item => {
      const keys = Object.keys(item).join(' ').toLowerCase();
      return keys.includes('voto') || keys.includes('porcentaje') || keys.includes('organizacion') || keys.includes('candidato') || keys.includes('participante');
    }));

    likelyArrays.forEach(arr => {
      arr.forEach(item => {
        const nombre = item.nombreCandidato || item.candidatoNombre || item.candidato || deepFind(item, ['participante', 'descripcion']) || 'Sin nombre';
        const organizacion = item.nombreAgrupacionPolitica || item.organizacionPolitica || item.nombreOrganizacionPolitica || item.partido || '';
        const votos = toNumber(item.totalVotosValidos ?? item.totalVotos ?? item.votos ?? item.cantidadVotos ?? item.votosValidos ?? item.cantidad);
        const porcentaje = toNumber(item.porcentajeVotosValidos ?? item.porcentajeValidos ?? item.porcentajeVotos ?? item.porcentaje ?? item.porc);
        if (nombre && nombre !== 'Sin nombre' && (votos || porcentaje)) {
          allItems.push({ nombre, organizacion, votos, porcentaje });
        }
      });
    });
  });

  const deduped = new Map();
  allItems.forEach(item => {
    const key = `${item.nombre}|${item.organizacion}`.toLowerCase();
    const prev = deduped.get(key);
    if (!prev || item.votos > prev.votos || item.porcentaje > prev.porcentaje) deduped.set(key, item);
  });

  const result = [...deduped.values()].filter(x => x.nombre !== 'Sin nombre' || x.organizacion || x.votos > 0);
  return result.sort((a, b) => {
    const sideA = partyInfo(a.organizacion).side === 'left' ? 0 : partyInfo(a.organizacion).side === 'right' ? 1 : 2;
    const sideB = partyInfo(b.organizacion).side === 'left' ? 0 : partyInfo(b.organizacion).side === 'right' ? 1 : 2;
    return sideA - sideB || b.votos - a.votos || b.porcentaje - a.porcentaje;
  });
}

function normalizeLocations(...rawSources) {
  const rows = [];

  rawSources.filter(Boolean).forEach(raw => {
    const arrays = findArrays(raw);
    const locationArrays = arrays.filter(arr => arr.some(item => {
      const keys = Object.keys(item).join(' ').toLowerCase();
      return keys.includes('ubigeo') || keys.includes('departamento') || keys.includes('continente') || keys.includes('region') || keys.includes('ubicacion') || keys.includes('provincia') || keys.includes('distrito');
    }));

    locationArrays.forEach(arr => {
      arr.forEach(item => {
        const ubicacion = deepFind(item, ['departamento', 'region', 'ubicacion', 'nombreUbicacion', 'nombre', 'continente', 'provincia', 'distrito']) || 'Sin ubicación';
        const ganador = deepFind(item, ['ganador', 'candidato', 'nombreCandidato', 'participante', 'organizacionPolitica']) || 'No definido';
        const votos = toNumber(deepFind(item, ['totalVotos', 'votos', 'cantidadVotos', 'votosValidos', 'cantidad']));
        const porcentaje = toNumber(deepFind(item, ['porcentaje', 'porc', 'porcentajeVotos', 'porcentajeValidos']));
        if (ubicacion !== 'Sin ubicación') rows.push({ ubicacion, ganador, votos, porcentaje });
      });
    });
  });

  const deduped = new Map();
  rows.forEach(item => {
    const key = `${item.ubicacion}|${item.ganador}`.toLowerCase();
    const prev = deduped.get(key);
    if (!prev || item.votos > prev.votos || item.porcentaje > prev.porcentaje) deduped.set(key, item);
  });

  return [...deduped.values()].sort((a, b) => b.votos - a.votos || b.porcentaje - a.porcentaje);
}

function buildDepartmentRows(departamentosRaw, heatAmbitoRaw) {
  const departments = extractData(departamentosRaw) || [];
  const heat = extractData(heatAmbitoRaw) || [];
  const heatByUbigeo = new Map(heat.map(item => [String(item.ubigeoNivel01 || '').padStart(6, '0'), item]));

  return departments.map(department => {
    const metric = heatByUbigeo.get(String(department.ubigeo || '').padStart(6, '0')) || {};
    const porcentaje = toNumber(metric.porcentajeActasContabilizadas);
    return {
      ubicacion: department.nombre,
      ganador: porcentaje >= 99 ? 'Casi completo' : porcentaje >= 95 ? 'Alto avance' : porcentaje >= 90 ? 'En conteo' : 'Pendiente',
      votos: toNumber(metric.actasContabilizadas),
      porcentaje
    };
  }).sort((a, b) => b.porcentaje - a.porcentaje || b.votos - a.votos);
}

function updateKpis(t) {
  const pendingActs = Math.max(0, 100 - Math.min(t.contabilizadas || 0, 100));
  qs('processedActs').textContent = pct(t.procesadas);
  qs('countedActs').textContent = pct(pendingActs);
  qs('participation').textContent = pct(t.participacion);
  qs('validVotes').textContent = t.votosValidos ? fmt.format(t.votosValidos) : '--';
  qs('processedBar').style.width = `${Math.min(t.procesadas, 100)}%`;
  qs('countedBar').style.width = `${pendingActs}%`;
  qs('participationBar').style.width = `${Math.min(t.participacion, 100)}%`;
  qs('totalVotesNote').textContent = t.mesasProcesadas || t.mesasContabilizadas
    ? `Mesas: ${t.mesasProcesadas ? pct(t.mesasProcesadas) : '--'} procesadas · ${t.mesasContabilizadas ? pct(t.mesasContabilizadas) : '--'} contabilizadas`
    : 'Según disponibilidad del endpoint';
}

function shortCandidateName(name = '') {
  const clean = name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()).trim();
  if (clean.includes('Fujimori')) return 'Keiko Fujimori';
  if (clean.includes('Sanchez') || clean.includes('Sánchez')) return 'Roberto Sánchez';
  return clean || 'Sin nombre';
}

function initials(name = '') {
  const parts = shortCandidateName(name).split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase() || '--';
}

function candidatePhoto(name = '') {
  const normalized = normalizeText(name);
  if (normalized.includes('FUJIMORI')) return candidatePhotos['KEIKO SOFIA FUJIMORI HIGUCHI'];
  if (normalized.includes('SANCHEZ')) return candidatePhotos['ROBERTO HELBERT SANCHEZ PALOMINO'];
  return candidatePhotos[normalized] || '';
}

function candidateFallbackPhoto(name = '') {
  const normalized = normalizeText(name);
  if (normalized.includes('SANCHEZ')) return candidatePhotoFallbacks['ROBERTO HELBERT SANCHEZ PALOMINO'];
  return candidatePhotoFallbacks[normalized] || '';
}

function partyInfo(organizacion = '') {
  return partyAssets[normalizeText(organizacion)] || { logo: '', side: 'neutral' };
}

function partyLabel(organizacion = '') {
  const info = partyInfo(organizacion);
  const logo = info.logo ? `<img src="${info.logo}" alt="${organizacion}" loading="lazy" referrerpolicy="no-referrer">` : '';
  return `<span class="party-label">${logo}<span>${organizacion || '--'}</span></span>`;
}

function renderAvatar(elementId, candidate) {
  const element = qs(elementId);
  const photo = candidatePhoto(candidate?.nombre || '');
  const fallbackPhoto = candidateFallbackPhoto(candidate?.nombre || '');
  const fallbackText = initials(candidate?.nombre || '');
  if (!element) return;
  element.innerHTML = photo
    ? `<img src="${photo}" alt="${shortCandidateName(candidate?.nombre || '')}" loading="lazy" referrerpolicy="no-referrer" onerror="if('${fallbackPhoto}' && this.src !== '${fallbackPhoto}') { this.src='${fallbackPhoto}'; } else { this.remove();this.parentElement.textContent='${fallbackText}'; }">`
    : fallbackText;
}

function avatarMarkup(candidate) {
  const photo = candidatePhoto(candidate?.nombre || '');
  const fallbackPhoto = candidateFallbackPhoto(candidate?.nombre || '');
  const fallbackText = initials(candidate?.nombre || '');
  return photo
    ? `<img src="${photo}" alt="${shortCandidateName(candidate?.nombre || '')}" loading="lazy" referrerpolicy="no-referrer" onerror="if('${fallbackPhoto}' && this.src !== '${fallbackPhoto}') { this.src='${fallbackPhoto}'; } else { this.remove();this.parentElement.textContent='${fallbackText}'; }">`
    : fallbackText;
}

function updateRefreshCountdown() {
  if (!state.nextRefreshAt) return;
  const remaining = Math.max(0, Math.ceil((state.nextRefreshAt - Date.now()) / 1000));
  const nextText = `Próxima actualización en ${remaining} segundos`;
  const lastUpdate = qs('lastUpdate');
  if (lastUpdate) {
    const base = lastUpdate.dataset.base || 'Última actualización: pendiente';
    lastUpdate.textContent = `${base} · ${nextText}`;
  }
}

function scheduleAutoRefresh() {
  window.clearInterval(state.refreshTimer);
  state.nextRefreshAt = Date.now() + REFRESH_SECONDS * 1000;
  updateRefreshCountdown();
  state.refreshTimer = window.setInterval(() => {
    updateRefreshCountdown();
    if (Date.now() >= state.nextRefreshAt && !state.loading) loadData();
  }, 1000);
}

function extractData(raw) {
  return raw?.data ?? raw;
}

function normalizeText(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

function regionColor(value) {
  const n = Math.max(0, Math.min(Number(value || 0), 100));
  if (n >= 99.5) return '#7f0d12';
  if (n >= 99) return '#a31319';
  if (n >= 98) return '#cf1f2e';
  if (n >= 96) return '#e43b28';
  if (n >= 92) return '#ff6d20';
  if (n >= 80) return '#ff9a4d';
  return '#ffd166';
}

function updateDuel(participants, totalsRaw) {
  const data = extractData(totalsRaw) || {};
  const counted = toNumber(data.actasContabilizadas || data.porcentajeActasContabilizadas);
  const countedLabel = counted ? pct3(counted) : '--';
  const totalActas = toNumber(data.totalActas);
  const contabilizadas = toNumber(data.contabilizadas);

  qs('heroCounted').textContent = countedLabel;
  qs('countedInline').textContent = countedLabel;
  qs('nationalTag').textContent = `al ${countedLabel}`;
  qs('actasInline').textContent = contabilizadas && totalActas ? `${fmt.format(contabilizadas)} de ${fmt.format(totalActas)} actas` : '-- de -- actas';
  qs('miniNeedle').style.left = `${Math.min(counted || 0, 100)}%`;

  // Orden fijo: Keiko (FP) izquierda, Roberto (JP) derecha
  const keiko = participants.find(p => normalizeText(p.organizacion).includes('FUERZA'));
  const roberto = participants.find(p => normalizeText(p.organizacion).includes('JUNTOS'));

  if (!keiko || !roberto) return;

  const totalVotes = Math.max(keiko.votos + roberto.votos, 1);
  const keikoShare = Math.max((keiko.votos / totalVotes) * 100, 0);
  const robertoShare = Math.max((roberto.votos / totalVotes) * 100, 0);
  const gap = Math.abs(keiko.votos - roberto.votos);
  const gapPct = Math.abs(keiko.porcentaje - roberto.porcentaje);
  const leader = keiko.votos >= roberto.votos ? keiko : roberto;

  // Izquierda = Keiko
  qs('leftPct').textContent = pct3(keiko.porcentaje);
  qs('leftName').textContent = shortCandidateName(keiko.nombre);
  qs('leftOrg').innerHTML = partyLabel(keiko.organizacion);
  qs('leftVotes').textContent = `${fmt.format(keiko.votos)} votos`;
  renderAvatar('leftAvatar', keiko);

  // Derecha = Roberto
  qs('rightPct').textContent = pct3(roberto.porcentaje);
  qs('rightName').textContent = shortCandidateName(roberto.nombre);
  qs('rightOrg').innerHTML = partyLabel(roberto.organizacion);
  qs('rightVotes').textContent = `${fmt.format(roberto.votos)} votos`;
  renderAvatar('rightAvatar', roberto);

  qs('splitLeft').style.width = `${keikoShare}%`;
  qs('splitRight').style.width = `${robertoShare}%`;
  qs('voteGap').textContent = fmt.format(gap);

  const note = document.querySelector('.breach-card em');
  if (note) note.textContent = `${shortCandidateName(leader.nombre)} +${gapPct.toFixed(3)} pts`;
}

function updateParticipation(totalsRaw) {
  const data = extractData(totalsRaw) || {};
  const participation = toNumber(data.participacionCiudadana);
  const emitted = toNumber(data.totalVotosEmitidos);
  const valid = toNumber(data.totalVotosValidos);
  const registered = participation ? Math.round(emitted / (participation / 100)) : 0;
  const blankNull = Math.max(emitted - valid, 0);
  const noVote = Math.max(registered - emitted, 0);

  qs('registeredCount').textContent = registered ? fmt.format(registered) : '--';
  qs('validCount').textContent = valid ? fmt.format(valid) : '--';
  qs('blankNullCount').textContent = blankNull ? fmt.format(blankNull) : '--';
  qs('noVoteCount').textContent = noVote ? fmt.format(noVote) : '--';
}

function findAmbitoTotals(scope) {
  const items = extractData(state.raw.totalsAmbitoRaw) || [];
  const target = scope === 'foreign' ? 'EXTRANJERO' : 'PERU';
  if (!Array.isArray(items)) return null;
  return items.find(item => {
    const label = deepFind(item, ['ambitoGeografico', 'ambito', 'region', 'ubicacion', 'nombre', 'descripcion', 'nombreAmbito']);
    return normalizeText(label).includes(target);
  }) || null;
}

function currentParticipationRaw() {
  return findAmbitoTotals(state.participationScope) || state.raw.totalsRaw || state.raw.totalsAmbitoRaw;
}

function updateParticipationView() {
  const isForeign = state.participationScope === 'foreign';
  const title = qs('participationTitle');
  const toggle = qs('participationScopeBtn');
  if (title) title.textContent = isForeign ? 'Extranjero' : 'Perú';
  if (toggle) toggle.textContent = isForeign ? 'Ver Perú' : 'Ver extranjero';
  updateParticipation(currentParticipationRaw());
  renderChart();
}

function renderCandidates(items) {
  if (!items.length) {
    qs('candidateList').innerHTML = '<p class="muted">Sin resultados oficiales disponibles. Ejecuta <code>npm run discover:onpe</code> para capturar la fuente oficial si Cloudflare la permite desde tu navegador.</p>';
    return;
  }

  const max = Math.max(...items.map(x => x.porcentaje || 0), 1);
  qs('candidateList').innerHTML = items.map((item, index) => `
    <div class="candidate-card">
      <div class="candidate-top">
        <div class="mini-avatar">${avatarMarkup(item)}</div>
        <div>
          <div class="candidate-name">${shortCandidateName(item.nombre)}</div>
          <div class="candidate-org">${partyLabel(item.organizacion || 'Organización no especificada')}</div>
        </div>
        <div class="candidate-votes">
          <strong>${pct(item.porcentaje)}</strong>
          <span>${item.votos ? fmt.format(item.votos) : '--'} votos</span>
        </div>
      </div>
      <div class="candidate-bar"><span style="width:${Math.min((item.porcentaje / max) * 100, 100)}%"></span></div>
    </div>
  `).join('');
}

function renderChart() {
  const canvas = qs('voteChart');
  if (!window.Chart || !canvas) return;
  if (state.chart) state.chart.destroy();
  const totalsRaw = currentParticipationRaw();
  const data = extractData(totalsRaw) || {};
  const emitted = toNumber(data.totalVotosEmitidos);
  const valid = toNumber(data.totalVotosValidos);
  const participation = toNumber(data.participacionCiudadana);
  const registered = participation ? Math.round(emitted / (participation / 100)) : 0;
  const blankNull = Math.max(emitted - valid, 0);
  const noVote = Math.max(registered - emitted, 0);
  if (!registered) {
    qs('registeredCount').textContent = '--';
    qs('validCount').textContent = '--';
    qs('blankNullCount').textContent = '--';
    qs('noVoteCount').textContent = '--';
    return;
  }
  state.chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Válidos', 'Blancos y nulos', 'No votaron'],
      datasets: [{
        data: [valid, blankNull, noVote],
        backgroundColor: ['#00a85a', '#e5b52e', '#9dafc3'],
        borderColor: '#f7f9fc',
        borderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${fmt.format(ctx.raw || 0)}`
          }
        }
      },
      cutout: '64%'
    }
  });
}

function sketchPath(points) {
  return points.map((point, index) => `${index ? 'L' : 'M'}${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(' ');
}

function renderProjectionChart(participants, totalsRaw) {
  const mount = qs('projectionSketch');
  if (!mount) return;

  const data = extractData(totalsRaw) || {};
  const counted = Math.max(toNumber(data.actasContabilizadas || data.porcentajeActasContabilizadas), 1);
  const keiko = participants.find(p => normalizeText(p.organizacion).includes('FUERZA'));
  const roberto = participants.find(p => normalizeText(p.organizacion).includes('JUNTOS'));
  if (!keiko || !roberto) return;

  const currentX = Math.min(counted, 99);
  const kCurrent = Number(keiko.porcentaje || 0);
  const rCurrent = Number(roberto.porcentaje || 0);
  const remainingInfluence = Math.max(0.08, (100 - currentX) / 100);
  const apiProjection = state.ronbProjection;
  const kProjected = apiProjection?.proy_keiko != null
    ? Math.max(0, Math.min(100, toNumber(apiProjection.proy_keiko)))
    : Math.max(0, Math.min(100, kCurrent + (kCurrent - 50) * remainingInfluence * 0.18));
  const rProjected = apiProjection?.proy_sanchez != null
    ? Math.max(0, Math.min(100, toNumber(apiProjection.proy_sanchez)))
    : Math.max(0, Math.min(100, 100 - kProjected));
  const leader = kProjected >= rProjected ? keiko : roberto;
  const gap = Math.abs(kProjected - rProjected);
  const chart = { left: 76, right: 872, top: 42, bottom: 278, minY: 46, maxY: 59 };
  const x = value => chart.left + (value / 100) * (chart.right - chart.left);
  const y = value => chart.bottom - ((value - chart.minY) / (chart.maxY - chart.minY)) * (chart.bottom - chart.top);
  const projectionX = x(currentX);
  const clampPct = value => Math.max(chart.minY, Math.min(chart.maxY, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const countedSamples = [0, 1, 2, 4, 8, 14, 22, 32, 44, 52, currentX]
    .filter((value, index, list) => value <= currentX && list.indexOf(value) === index);
  if (!countedSamples.includes(currentX)) countedSamples.push(currentX);
  const projectionSamples = Array.from({ length: 13 }, (_, index) => currentX + ((100 - currentX) * index / 12))
    .filter((value, index, list) => value >= currentX && value <= 100 && list.findIndex(x => Math.abs(x - value) < 0.001) === index);
  const countedCurve = countedSamples.map(actas => {
    const progress = currentX ? actas / currentX : 1;
    const lateDrop = smoothstep(Math.max(0, (progress - 0.68) / 0.32));
    const earlySpike = Math.exp(-Math.pow((progress - 0.015) / 0.018, 2)) * 1.25;
    const baseline = kCurrent + 2.65 * (1 - lateDrop) + earlySpike;
    const ripple = Math.sin(progress * Math.PI * 8) * 0.055 + Math.sin(progress * Math.PI * 17) * 0.025;
    const keikoPct = clampPct(baseline + ripple);
    return { actas, keiko: keikoPct, sanchez: 100 - keikoPct, projected: false };
  });
  countedCurve[countedCurve.length - 1] = { actas: currentX, keiko: kCurrent, sanchez: rCurrent, projected: false };
  const projectionCurve = projectionSamples.slice(1).map(actas => {
    const progress = (actas - currentX) / Math.max(100 - currentX, 1);
    const ease = progress * progress * (3 - 2 * progress);
    const keikoPct = clampPct(kCurrent + (kProjected - kCurrent) * ease);
    return { actas, keiko: keikoPct, sanchez: 100 - keikoPct, projected: true };
  });
  const points = [...countedCurve, ...projectionCurve];
  const currentIndex = countedCurve.length - 1;
  const kCountedPts = countedCurve.map(point => [x(point.actas), y(point.keiko)]);
  const rCountedPts = countedCurve.map(point => [x(point.actas), y(point.sanchez)]);
  const kProjectionPts = [points[currentIndex], ...projectionCurve].map(point => [x(point.actas), y(point.keiko)]);
  const rProjectionPts = [points[currentIndex], ...projectionCurve].map(point => [x(point.actas), y(point.sanchez)]);
  const hoverBands = points.map((point, index) => {
    const prevX = index ? x(points[index - 1].actas) : chart.left;
    const nextX = index < points.length - 1 ? x(points[index + 1].actas) : chart.right;
    const left = index ? (prevX + x(point.actas)) / 2 : chart.left;
    const right = index < points.length - 1 ? (x(point.actas) + nextX) / 2 : chart.right;
    return { index, left, width: Math.max(2, right - left) };
  });

  const note = qs('projectionNote');
  if (note) {
    const exteriorLegend = apiProjection?.ext_legend || 'Exterior con volumen real del conteo y % Datum';
    note.innerHTML = `<strong>${escapeHtml(exteriorLegend)}</strong> · Proyección distrital al 100%. El voto que falta de cada distrito se proyecta con su propio resultado ya contado.`;
  }

  mount.innerHTML = `
    <div class="projection-chart-shell">
      <svg class="projection-svg" viewBox="0 0 940 360" role="img" aria-label="Evolución interactiva de proyección electoral">
        <defs>
          <pattern id="projectionHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#9aa8b9" stroke-width="1" opacity=".3"/>
          </pattern>
        </defs>
        <rect class="sketch-paper" x="18" y="18" width="904" height="324" rx="4"/>
        <g class="sketch-grid">
          ${[46,48,50,52,54,56,58,59].map(v => `<line x1="${chart.left}" y1="${y(v)}" x2="${chart.right}" y2="${y(v)}"/><text x="42" y="${y(v) + 4}">${v}%</text>`).join('')}
          ${[0,20,40,60,80,100].map(v => `<line x1="${x(v)}" y1="${chart.top}" x2="${x(v)}" y2="${chart.bottom}"/><text x="${x(v) - 8}" y="314">${v}%</text>`).join('')}
        </g>
        <rect class="projection-zone" x="${projectionX}" y="${chart.top}" width="${x(100) - projectionX}" height="${chart.bottom - chart.top}" fill="url(#projectionHatch)"/>
        <line class="projection-cut" x1="${projectionX}" y1="${chart.top}" x2="${projectionX}" y2="${chart.bottom}"/>
        <line class="majority-line" x1="${chart.left}" y1="${y(50)}" x2="${chart.right}" y2="${y(50)}"/>
        <text class="majority-label" x="${chart.left + 4}" y="${y(50) - 8}">Mayoría 50%</text>
        <text class="axis-label y-axis" x="24" y="174">% DE VOTOS VÁLIDOS</text>
        <text class="axis-label" x="404" y="340">% DE ACTAS COMPUTADAS</text>
        <text class="projection-word" x="${Math.max(projectionX + 8, 818)}" y="55">PROYECCIÓN</text>
        <path class="sketch-line keiko-line" d="${sketchPath(kCountedPts)}"/>
        <path class="sketch-line roberto-line" d="${sketchPath(rCountedPts)}"/>
        <path class="projection-dash keiko-dash" d="${sketchPath(kProjectionPts)}"/>
        <path class="projection-dash roberto-dash" d="${sketchPath(rProjectionPts)}"/>
        <line class="projection-hover-line" id="projectionHoverLine" x1="${projectionX}" y1="${chart.top}" x2="${projectionX}" y2="${chart.bottom}"/>
        <circle class="projection-hover-dot keiko-end" id="projectionKeikoDot" cx="${projectionX}" cy="${y(kCurrent)}" r="5"/>
        <circle class="projection-hover-dot roberto-end" id="projectionRobertoDot" cx="${projectionX}" cy="${y(rCurrent)}" r="5"/>
        <circle class="end-dot keiko-end" cx="${x(100)}" cy="${y(kProjected)}" r="5"/>
        <circle class="end-dot roberto-end" cx="${x(100)}" cy="${y(rProjected)}" r="5"/>
        <text class="end-label keiko-label" x="884" y="${y(kProjected) - 7}">~${kProjected.toFixed(3)}%</text>
        <text class="end-label roberto-label" x="884" y="${y(rProjected) + 16}">~${rProjected.toFixed(3)}%</text>
        ${hoverBands.map(band => `<rect class="projection-hotspot" tabindex="0" data-index="${band.index}" x="${band.left.toFixed(1)}" y="${chart.top}" width="${band.width.toFixed(1)}" height="${chart.bottom - chart.top}" rx="0"><title>ONPE al ${points[band.index].actas.toFixed(1)}% de actas</title></rect>`).join('')}
        <rect class="projection-hover-overlay" tabindex="0" x="${chart.left}" y="${chart.top}" width="${chart.right - chart.left}" height="${chart.bottom - chart.top}" rx="0"/>
      </svg>
      <div class="projection-tooltip" id="projectionTooltip" hidden></div>
    </div>
  `;

  const svg = mount.querySelector('.projection-svg');
  const tooltip = mount.querySelector('#projectionTooltip');
  const hoverLine = mount.querySelector('#projectionHoverLine');
  const keikoDot = mount.querySelector('#projectionKeikoDot');
  const robertoDot = mount.querySelector('#projectionRobertoDot');
  const interpolatePoint = actas => {
    const clamped = Math.max(0, Math.min(100, actas));
    let prev = points[0];
    let next = points[points.length - 1];
    for (let i = 1; i < points.length; i++) {
      if (points[i].actas >= clamped) {
        prev = points[i - 1];
        next = points[i];
        break;
      }
    }
    const span = Math.max(next.actas - prev.actas, 0.0001);
    const t = Math.max(0, Math.min(1, (clamped - prev.actas) / span));
    return {
      actas: clamped,
      keiko: prev.keiko + (next.keiko - prev.keiko) * t,
      sanchez: prev.sanchez + (next.sanchez - prev.sanchez) * t,
      projected: clamped > currentX + 0.001
    };
  };
  const showPoint = pointOrIndex => {
    const point = typeof pointOrIndex === 'number' ? points[pointOrIndex] : pointOrIndex;
    if (!point || !tooltip || !hoverLine || !keikoDot || !robertoDot) return;
    const px = x(point.actas);
    const ky = y(point.keiko);
    const ry = y(point.sanchez);
    hoverLine.setAttribute('x1', px.toFixed(1));
    hoverLine.setAttribute('x2', px.toFixed(1));
    keikoDot.setAttribute('cx', px.toFixed(1));
    keikoDot.setAttribute('cy', ky.toFixed(1));
    robertoDot.setAttribute('cx', px.toFixed(1));
    robertoDot.setAttribute('cy', ry.toFixed(1));
    tooltip.hidden = false;
    tooltip.style.left = `${Math.max(16, Math.min((px / 940) * 100, 78))}%`;
    tooltip.style.top = `${Math.max(16, Math.min((Math.min(ky, ry) / 360) * 100 + 3, 68))}%`;
    tooltip.innerHTML = `
      <strong>ONPE al ${point.actas.toFixed(1)}% de actas</strong>
      <span><i class="keiko-dot"></i>Keiko Fujimori: ${point.keiko.toFixed(3)}%</span>
      <span><i class="roberto-dot"></i>Roberto Sánchez: ${point.sanchez.toFixed(3)}%</span>
      ${point.projected ? '<em>Tramo proyectado</em>' : ''}
    `;
  };
  const hidePoint = () => {
    if (tooltip) tooltip.hidden = true;
  };
  const showFromClientX = clientX => {
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / Math.max(rect.width, 1)) * 940;
    const actas = ((svgX - chart.left) / (chart.right - chart.left)) * 100;
    showPoint(interpolatePoint(actas));
  };
  mount.querySelectorAll('.projection-hotspot').forEach(hotspot => {
    const show = () => showPoint(Number(hotspot.dataset.index));
    hotspot.addEventListener('mouseenter', show);
    hotspot.addEventListener('focus', show);
    hotspot.addEventListener('touchstart', event => { event.preventDefault(); show(); }, { passive: false });
  });
  const overlay = mount.querySelector('.projection-hover-overlay');
  if (overlay) {
    overlay.addEventListener('pointermove', event => showFromClientX(event.clientX));
    overlay.addEventListener('pointerenter', event => showFromClientX(event.clientX));
    overlay.addEventListener('touchstart', event => {
      event.preventDefault();
      if (event.touches?.[0]) showFromClientX(event.touches[0].clientX);
    }, { passive: false });
    overlay.addEventListener('focus', () => showPoint(interpolatePoint(currentX)));
  }
  mount.querySelector('.projection-chart-shell')?.addEventListener('mouseleave', hidePoint);
}

function renderLocations(rows = state.locations) {
  if (!qs('locationRows')) return;
  const topRows = rows.slice(0, 80);
  qs('locationRows').innerHTML = topRows.map((x, index) => `
    <article class="department-card" style="--dept-color:${regionColor(x.porcentaje)};--dept-progress:${Math.min(Number(x.porcentaje || 0), 100)}%">
      <div class="department-rank">${String(index + 1).padStart(2, '0')}</div>
      <div class="department-main">
        <div class="department-name">${escapeHtml(x.ubicacion)}</div>
        <div class="department-status">${escapeHtml(x.ganador)}</div>
        <div class="department-meter"><span></span></div>
      </div>
      <div class="department-score">
        <strong>${pct3(x.porcentaje)}</strong>
        <span>${x.votos ? fmt.format(x.votos) : '--'} actas</span>
      </div>
    </article>
  `).join('') || '<p class="muted">No se encontraron datos de ubicacion en la respuesta actual.</p>';
}

function candidatePair(raw) {
  const items = normalizeParticipants(raw);
  const keiko = items.find(p => normalizeText(p.organizacion).includes('FUERZA')) || { votos: 0, porcentaje: 0 };
  const sanchez = items.find(p => normalizeText(p.organizacion).includes('JUNTOS')) || { votos: 0, porcentaje: 0 };
  return { keiko, sanchez };
}

function cleanOnpeName(value = '') {
  const fixed = String(value)
    .replace(/ESPA�A/g, 'ESPAÑA')
    .replace(/AM�RICA/g, 'AMÉRICA')
    .replace(/OCEAN�A/g, 'OCEANÍA')
    .replace(/PER�/g, 'PERÚ')
    .replace(/�/g, 'Ñ')
    .trim();
  return fixed.toLocaleLowerCase('es-PE').split(/\s+/).map((word, index) => {
    if (index > 0 && ['de', 'del', 'la', 'las', 'el', 'los', 'y'].includes(word)) return word;
    return word.charAt(0).toLocaleUpperCase('es-PE') + word.slice(1);
  }).join(' ');
}

function countryFlag(name = '') {
  const iso = countryIso[normalizeText(name)];
  return iso ? `<span class="fi fi-${iso}"></span>` : '<span class="flag-fallback">🌐</span>';
}

async function loadWorldCountryRows(continentsRaw) {
  const continents = extractData(continentsRaw) || [];
  const countryLists = await Promise.all(continents.map(async continent => {
    const continentId = String(continent.ubigeo || '').padStart(6, '0');
    try {
      const countriesRaw = await getOnpeUrl(`/ubigeos/provincias?idEleccion=10&idAmbitoGeografico=2&idUbigeoDepartamento=${continentId}`);
      const countries = extractData(countriesRaw) || [];
      return countries.map(country => ({
        continent: cleanOnpeName(continent.nombre),
        continentId,
        country: cleanOnpeName(country.nombre),
        countryId: String(country.ubigeo || '').padStart(6, '0')
      }));
    } catch (error) {
      return [];
    }
  }));

  const countryRefs = countryLists.flat();
  const rows = await Promise.all(countryRefs.map(async ref => {
    try {
      const [totalsRaw, participantsRaw] = await Promise.all([
        getOnpeUrl(`/resumen-general/totales?idEleccion=10&tipoFiltro=ubigeo_nivel_02&idAmbitoGeografico=2&idUbigeoDepartamento=${ref.continentId}&idUbigeoProvincia=${ref.countryId}`),
        getOnpeUrl(`/resumen-general/participantes?idEleccion=10&tipoFiltro=ubigeo_nivel_02&idAmbitoGeografico=2&idUbigeoDepartamento=${ref.continentId}&idUbigeoProvincia=${ref.countryId}`)
      ]);
      const totals = extractData(totalsRaw) || {};
      const pair = candidatePair(participantsRaw);
      const totalVotes = pair.keiko.votos + pair.sanchez.votos;
      if (!totalVotes) return null;
      return {
        ...ref,
        type: 'País',
        actas: toNumber(totals.contabilizadas),
        totalActas: toNumber(totals.totalActas),
        avance: toNumber(totals.actasContabilizadas),
        validVotes: toNumber(totals.totalVotosValidos) || totalVotes,
        keikoVotes: pair.keiko.votos,
        sanchezVotes: pair.sanchez.votos,
        keikoPct: pair.keiko.porcentaje || (pair.keiko.votos / totalVotes) * 100,
        sanchezPct: pair.sanchez.porcentaje || (pair.sanchez.votos / totalVotes) * 100
      };
    } catch (error) {
      return null;
    }
  }));

  return rows.filter(Boolean).sort((a, b) => b.validVotes - a.validVotes);
}

function buildWorldRows(continentsRaw, heatRaw, exteriorRaw) {
  const continents = extractData(continentsRaw) || [];
  const heat = extractData(heatRaw) || [];
  const heatById = new Map(heat.map(item => [String(item.ubigeoNivel01 || item.ubigeo || '').padStart(6, '0'), item]));
  const pair = candidatePair(exteriorRaw);
  const totalVotes = Math.max(pair.keiko.votos + pair.sanchez.votos, 1);
  const totalActas = heat.reduce((sum, item) => sum + toNumber(item.actasContabilizadas), 0) || 1;

  return continents.map(continent => {
    const id = String(continent.ubigeo || '').padStart(6, '0');
    const metric = heatById.get(id) || {};
    const actas = toNumber(metric.actasContabilizadas);
    const share = actas / totalActas;
    const keikoVotes = Math.round(pair.keiko.votos * share);
    const sanchezVotes = Math.round(pair.sanchez.votos * share);
    return {
      name: String(continent.nombre || '').replace('�', 'É'),
      type: 'Continente',
      actas,
      avance: toNumber(metric.porcentajeActasContabilizadas),
      keikoVotes,
      sanchezVotes,
      keikoPct: (pair.keiko.votos / totalVotes) * 100,
      sanchezPct: (pair.sanchez.votos / totalVotes) * 100
    };
  }).sort((a, b) => (b.keikoVotes + b.sanchezVotes) - (a.keikoVotes + a.sanchezVotes));
}

function renderWorldVoteRows(rows) {
  const selectedContinent = qs('continentFilter')?.value || 'all';
  const selectedCountry = qs('countryFilter')?.value || 'all';
  const filtered = rows.filter(row => (selectedContinent === 'all' || row.continent === selectedContinent) && (selectedCountry === 'all' || row.country === selectedCountry));
  const mount = qs('worldVoteRows');
  if (!mount) return;
  mount.innerHTML = filtered.map(row => {
    const kPct = Math.max(0, Math.min(row.keikoPct || 0, 100));
    const sPct = Math.max(0, Math.min(row.sanchezPct || 0, 100));
    const keikoWins = kPct >= sPct;
    const leader = keikoWins ? 'K' : 'S';
    const leaderPct = keikoWins ? kPct : sPct;
    const leaderClass = keikoWins ? 'keiko-text' : 'sanchez-text';
    return `
      <article class="world-row">
        <div class="world-flag">${row.iso ? `<span class="fi fi-${escapeHtml(row.iso)}"></span>` : countryFlag(row.country || row.name)}</div>
        <div class="world-country">
          <strong>${escapeHtml(row.country || row.name)}</strong>
          <span>${pct3(row.avance)} actas</span>
        </div>
        <div class="world-split-bar">
          <i class="keiko-bar" style="width:${kPct}%"></i>
          <i class="sanchez-bar" style="width:${sPct}%"></i>
        </div>
        <div class="world-score">
          <strong class="${leaderClass}">${leader} ${pct3(leaderPct)}</strong>
          <span>${fmt.format(row.validVotes || row.keikoVotes + row.sanchezVotes)} votos</span>
        </div>
      </article>`;
  }).join('') || '<p class="muted">No hay países para el filtro seleccionado.</p>';
}

async function renderWorldVote(continentsRaw, heatRaw, exteriorRaw) {
  let rows = [];
  if (state.ronbExterior) rows = ronbWorldRows(state.ronbExterior);
  if (!rows.length) {
    try {
      rows = await loadWorldCountryRows(continentsRaw);
    } catch (error) {
      rows = [];
    }
  }
  if (!rows.length) rows = buildWorldRows(continentsRaw, heatRaw, exteriorRaw);
  if (!rows.length) rows = fallback.worldRows;
  const pair = candidatePair(exteriorRaw);
  const fallbackVotes = rows.reduce((sum, row) => sum + toNumber(row.validVotes), 0);
  const fallbackKeikoVotes = rows.reduce((sum, row) => sum + Math.round(toNumber(row.validVotes) * toNumber(row.keikoPct) / 100), 0);
  const fallbackSanchezVotes = Math.max(fallbackVotes - fallbackKeikoVotes, 0);
  const worldPair = pair.keiko.votos || pair.sanchez.votos
    ? pair
    : {
        keiko: { ...fallback.participants[0], votos: fallbackKeikoVotes, porcentaje: fallbackVotes ? (fallbackKeikoVotes / fallbackVotes) * 100 : 0 },
        sanchez: { ...fallback.participants[1], votos: fallbackSanchezVotes, porcentaje: fallbackVotes ? (fallbackSanchezVotes / fallbackVotes) * 100 : 0 }
      };
  const totalVotes = worldPair.keiko.votos + worldPair.sanchez.votos;
  const headline = qs('worldHeadline');
  if (headline && totalVotes) {
    const avance = state.ronbExterior?.total?.at ? (toNumber(state.ronbExterior.total.ac) / toNumber(state.ronbExterior.total.at)) * 100 : toNumber(deepFind(heatRaw, ['porcentajeActasContabilizadas'])) || toNumber(deepFind(exteriorRaw, ['porcentajeActasContabilizadas']));
    headline.innerHTML = `Al <strong>${pct3(avance || 0)}</strong> · <strong>${fmt.format(totalVotes)}</strong> votos válidos`;
  }

  const keikoTotal = qs('keikoTotal');
  const sanchezTotal = qs('sanchezTotal');
  if (keikoTotal) keikoTotal.textContent = `${pct3(worldPair.keiko.porcentaje)}% · ${fmt.format(worldPair.keiko.votos)}`;
  if (sanchezTotal) sanchezTotal.textContent = `${pct3(worldPair.sanchez.porcentaje)}% · ${fmt.format(worldPair.sanchez.votos)}`;
  const worldHeader = document.querySelector('.world-panel .world-header');
  if (worldHeader) {
    worldHeader.style.setProperty('--world-keiko', `${Math.max(0, Math.min(worldPair.keiko.porcentaje || 0, 100))}%`);
    worldHeader.style.setProperty('--world-sanchez', `${Math.max(0, Math.min(worldPair.sanchez.porcentaje || 0, 100))}%`);
  }

  const continentFilter = qs('continentFilter');
  if (continentFilter) {
    const continents = [...new Set(rows.map(row => row.continent || row.name).filter(Boolean))].sort();
    continentFilter.innerHTML = '<option value="all">🌎 Todos los continentes</option>' + continents.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
  }
  const countryFilter = qs('countryFilter');
  if (countryFilter) {
    countryFilter.innerHTML = '<option value="all">Todos los países</option>' + rows.map(row => row.country).filter(Boolean).sort().map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
  }
  state.worldRows = rows;
  renderWorldVoteRows(rows);
  const note = qs('worldVoteNote');
  if (note && rows.some(row => row.country)) note.textContent = 'Datos oficiales ONPE por país. Los porcentajes y votos se actualizan con cada refresco.';
}

function buildPendingVoteRows(locations, totalsRaw, exteriorRaw) {
  const pair = candidatePair(totalsRaw);
  const exteriorPair = candidatePair(exteriorRaw);
  const nationalTotal = Math.max(pair.keiko.votos + pair.sanchez.votos, 1);
  const nationalMargin = (pair.keiko.votos - pair.sanchez.votos) / nationalTotal;
  const exteriorTotal = Math.max(exteriorPair.keiko.votos + exteriorPair.sanchez.votos, 1);
  const exteriorMargin = (exteriorPair.keiko.votos - exteriorPair.sanchez.votos) / exteriorTotal;
  const avgVotesPerActa = Math.max(nationalTotal / Math.max(locations.reduce((sum, row) => sum + (row.votos || 0), 0), 1), 1);

  const rows = locations.map(row => {
    const pendingActas = row.porcentaje ? (row.votos || 0) * ((100 - row.porcentaje) / Math.max(row.porcentaje, 1)) : 0;
    const net = Math.round(pendingActas * avgVotesPerActa * nationalMargin);
    return { name: row.ubicacion, net, pendingActas };
  });

  if (exteriorPair.keiko.votos || exteriorPair.sanchez.votos) {
    rows.push({ name: 'Exterior', net: Math.round(exteriorTotal * Math.max(0, 100 - toNumber(deepFind(state.raw.mesasExteriorRaw, ['porcentajeActasContabilizadas']))) / 100 * exteriorMargin), pendingActas: 0 });
  }

  return rows.filter(row => Math.abs(row.net) > 0).sort((a, b) => b.net - a.net);
}

async function loadTerritoryDetailRows(departamentosRaw, continentsRaw) {
  const departments = (extractData(departamentosRaw) || []).map(item => ({
    name: cleanOnpeName(item.nombre),
    ubigeo: String(item.ubigeo || '').padStart(6, '0'),
    ambito: 1,
    type: 'Departamento'
  }));
  const continents = (extractData(continentsRaw) || []).map(item => ({
    name: `Exterior (${cleanOnpeName(item.nombre)})`,
    ubigeo: String(item.ubigeo || '').padStart(6, '0'),
    ambito: 2,
    type: 'Exterior'
  }));

  const refs = [...departments, ...continents];
  const rows = await Promise.all(refs.map(async ref => {
    try {
      const [totalsRaw, participantsRaw] = await Promise.all([
        getOnpeUrl(`/resumen-general/totales?idEleccion=10&tipoFiltro=ubigeo_nivel_01&idAmbitoGeografico=${ref.ambito}&idUbigeoDepartamento=${ref.ubigeo}`),
        getOnpeUrl(`/resumen-general/participantes?idEleccion=10&tipoFiltro=ubigeo_nivel_01&idAmbitoGeografico=${ref.ambito}&idUbigeoDepartamento=${ref.ubigeo}`)
      ]);
      const totals = extractData(totalsRaw) || {};
      const pair = candidatePair(participantsRaw);
      const validVotes = toNumber(totals.totalVotosValidos) || pair.keiko.votos + pair.sanchez.votos;
      return {
        ...ref,
        actasContabilizadasPct: toNumber(totals.actasContabilizadas),
        actasContabilizadas: toNumber(totals.contabilizadas),
        totalActas: toNumber(totals.totalActas),
        actasJee: toNumber(totals.enviadasJee),
        actasPendientesJee: toNumber(totals.pendientesJee),
        validVotes,
        keikoVotes: pair.keiko.votos,
        sanchezVotes: pair.sanchez.votos,
        margin: validVotes ? (pair.keiko.votos - pair.sanchez.votos) / validVotes : 0
      };
    } catch (error) {
      return null;
    }
  }));
  return rows.filter(Boolean);
}

function renderPendingVote(territories) {
  const rawRows = territories.map(row => {
    if (typeof row.pendingNet === 'number') return { name: row.name, net: row.pendingNet, pendingActas: row.pendingActas || 0 };
    const pendingActas = Math.max(0, (row.totalActas || 0) - (row.actasContabilizadas || 0));
    const votesPerActa = row.actasContabilizadas ? row.validVotes / row.actasContabilizadas : 0;
    return { name: row.name, net: Math.round(pendingActas * votesPerActa * row.margin), pendingActas };
  }).filter(row => Math.abs(row.net) > 0);
  const exteriorNet = rawRows
    .filter(row => normalizeText(row.name).startsWith('EXTERIOR'))
    .reduce((sum, row) => sum + row.net, 0);
  const departmentRows = rawRows
    .filter(row => !normalizeText(row.name).startsWith('EXTERIOR'))
    .sort((a, b) => b.net - a.net);
  const rows = [
    ...(exteriorNet ? [{ name: 'Exterior (Real · Datum)', net: exteriorNet, pendingActas: 0 }] : []),
    ...departmentRows
  ].slice(0, 26);
  const max = Math.max(...rows.map(row => Math.abs(row.net)), 1);
  const mount = qs('pendingVoteChart');
  if (!mount) return;
  const axisMax = max > 50000 ? 60040 : Math.ceil(max / 10000) * 10000 || max;
  const axisStep = axisMax === 60040 ? 20000 : Math.round(axisMax / 3);
  const ticks = [axisMax, axisStep * 2, axisStep, 0, axisStep, axisStep * 2, axisMax];
  mount.innerHTML = `
    <div class="pending-legend"><span><i class="sanchez-impact"></i>Le suma a Sánchez</span><span><i class="keiko-impact"></i>Le suma a Keiko</span></div>
    <div class="pending-plot">
      <div class="pending-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="pending-bars">
    ${rows.map(row => `
        <div class="pending-row">
          <span>${escapeHtml(row.name)}</span>
          <div class="pending-axis">
            <i class="${row.net >= 0 ? 'keiko-impact' : 'sanchez-impact'}" style="width:${Math.max(2, Math.abs(row.net) / axisMax * 50)}%;${row.net >= 0 ? 'left:50%' : 'right:50%'}"></i>
            <strong class="${row.net >= 0 ? 'keiko-text' : 'sanchez-text'}" style="${row.net >= 0 ? `left:calc(50% + ${Math.abs(row.net) / axisMax * 50}% + 6px)` : `right:calc(50% + ${Math.abs(row.net) / axisMax * 50}% + 6px)`}">${row.net >= 0 ? '~+' : '~-'}${fmt.format(Math.abs(row.net))}</strong>
          </div>
        </div>
      `).join('') || '<p class="muted">No hay suficientes datos para estimar voto pendiente.</p>'}
      </div>
      <div class="pending-ticks">${ticks.map(tick => `<span>${fmt.format(tick)}</span>`).join('')}</div>
    </div>
    <div class="pending-axis-label">Voto NETO aprox. que gana el líder del depto (← Sánchez · Keiko →)</div>`;

}

function renderJeeImpact(territories = []) {
  const mount = qs('jeeImpactTable');
  if (!mount) return;
  const rows = territories.map(row => {
    if (typeof row.estimatedVotes === 'number' && typeof row.net === 'number') return row;
    const votesPerActa = row.actasContabilizadas ? row.validVotes / row.actasContabilizadas : 0;
    const estimatedVotes = Math.round((row.actasJee || 0) * votesPerActa);
    const net = Math.round(estimatedVotes * row.margin);
    return { ...row, estimatedVotes, net };
  }).filter(row => row.actasJee > 0).sort((a, b) => b.actasJee - a.actasJee);

  if (rows.length) {
    const totalJee = rows.reduce((sum, row) => sum + row.actasJee, 0);
    const totalVotes = rows.reduce((sum, row) => sum + row.estimatedVotes, 0);
    const totalNet = rows.reduce((sum, row) => sum + row.net, 0);
    mount.innerHTML = `
      <table>
        <thead><tr><th>Procedencia</th><th>Actas en JEE</th><th>Votos est.</th><th>Neto estimado</th></tr></thead>
        <tbody>
          ${rows.map(row => `<tr><td>${escapeHtml(row.name)}</td><td>${fmt.format(row.actasJee)}</td><td>~${fmt.format(row.estimatedVotes)}</td><td class="${row.net >= 0 ? 'keiko-text' : 'sanchez-text'}">${row.net >= 0 ? '~+' : '~-'}${fmt.format(Math.abs(row.net))}</td></tr>`).join('')}
          <tr><td><strong>Total</strong></td><td><strong>${fmt.format(totalJee)}</strong></td><td><strong>~${fmt.format(totalVotes)}</strong></td><td><strong>${totalNet >= 0 ? '~+ Keiko ' : '~- Sánchez '}${fmt.format(Math.abs(totalNet))}</strong></td></tr>
        </tbody>
      </table>
    `;
    return;
  }
  mount.innerHTML = `
    <table>
      <thead><tr><th>Procedencia</th><th>Actas en JEE</th><th>Votos est.</th><th>Neto estimado</th></tr></thead>
      <tbody><tr><td colspan="4">No se encontró en los endpoints actuales una fuente oficial de actas JEE por procedencia. El módulo queda listo para activarse cuando ONPE publique esa data.</td></tr></tbody>
    </table>
  `;
}

function projectPoint(point, bounds, size) {
  const [lon, lat] = point;
  const padding = 18;
  const width = size.width - padding * 2;
  const height = size.height - padding * 2;
  const x = padding + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)) * width;
  const y = padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat || 1)) * height;
  return [x, y];
}

function collectCoordinates(geometry, points = []) {
  if (!geometry) return points;
  const scan = value => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      points.push(value);
      return;
    }
    value.forEach(scan);
  };
  scan(geometry.coordinates);
  return points;
}

function ringToPath(ring, bounds, size) {
  return ring.map((point, index) => {
    const [x, y] = projectPoint(point, bounds, size);
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ') + ' Z';
}

function geometryToPath(geometry, bounds, size) {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') return geometry.coordinates.map(ring => ringToPath(ring, bounds, size)).join(' ');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap(poly => poly.map(ring => ringToPath(ring, bounds, size))).join(' ');
  return '';
}

function geometryCenter(geometry, bounds, size) {
  const points = collectCoordinates(geometry);
  if (!points.length) return null;
  const avg = points.reduce((acc, [lon, lat]) => ({ lon: acc.lon + lon, lat: acc.lat + lat }), { lon: 0, lat: 0 });
  return projectPoint([avg.lon / points.length, avg.lat / points.length], bounds, size);
}

function geometryLngLatCenter(geometry) {
  const points = collectCoordinates(geometry);
  if (!points.length) return [-75.0152, -9.19];
  const avg = points.reduce((acc, [lon, lat]) => ({ lon: acc.lon + lon, lat: acc.lat + lat }), { lon: 0, lat: 0 });
  return [avg.lon / points.length, avg.lat / points.length];
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function buildRegionMetrics(departamentosRaw, heatRaw) {
  const departments = extractData(departamentosRaw) || [];
  const heat = extractData(heatRaw) || [];
  const byUbigeo = new Map(heat.map(item => [String(item.ubigeoNivel01 || '').padStart(6, '0'), item]));
  const byRegionId = new Map();

  departments.forEach(department => {
    const name = normalizeText(department.nombre);
    const regionId = regionIdByName[name];
    const metric = byUbigeo.get(String(department.ubigeo || '').padStart(6, '0')) || {};
    if (regionId) {
      const row = {
        name: department.nombre,
        percentage: toNumber(metric.porcentajeActasContabilizadas),
        counted: toNumber(metric.actasContabilizadas)
      };
      byRegionId.set(regionId, row);
      byRegionId.set(String(department.ubigeo || '').padStart(6, '0'), row);
    }
  });

  return byRegionId;
}

function topUniqueRegions(metrics, limit = 5) {
  const unique = new Map();
  [...metrics.values()].forEach(region => {
    const key = normalizeText(region.name || '');
    if (!key) return;
    const current = unique.get(key);
    if (!current || region.percentage > current.percentage) unique.set(key, region);
  });
  return [...unique.values()].sort((a, b) => b.percentage - a.percentage).slice(0, limit);
}

function renderStaticMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw) {
  const geo = extractData(geoRaw) || geoRaw;
  const features = Array.isArray(geo?.features) ? geo.features : [];
  if (!features.length) {
    qs('mapCanvas').innerHTML = '<p class="muted">Mapa base oficial no disponible todavía.</p>';
    return;
  }

  const metrics = buildRegionMetrics(departamentosRaw, heatAmbitoRaw);

  const allPoints = features.flatMap(feature => collectCoordinates(feature.geometry));
  const bounds = allPoints.reduce((acc, [lon, lat]) => ({
    minLon: Math.min(acc.minLon, lon),
    maxLon: Math.max(acc.maxLon, lon),
    minLat: Math.min(acc.minLat, lat),
    maxLat: Math.max(acc.maxLat, lat)
  }), { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity });
  const size = { width: 560, height: 680 };
  const labels = [];
  const paths = features.map((feature, index) => {
    const name = feature.properties?.name || feature.id || 'Región';
    const featureKey = feature.properties?.id || feature.id;
    const metric = metrics.get(featureKey) || metrics.get(String(feature.id || '').padStart(6, '0')) || { name, percentage: 0, counted: 0 };
    const color = regionColor(metric.percentage);
    const isLake = feature.properties?.TYPE === 'Lake';
    const center = !isLake && metric.percentage ? geometryCenter(feature.geometry, bounds, size) : null;
    if (center) {
      const [x, y] = center;
      const shortName = (metric.name || name).slice(0, 4).toUpperCase();
      const pctLabel = metric.percentage >= 99.5 ? '100%' : `${Math.round(metric.percentage)}%`;
      labels.push(`<text class="region-label" x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}">${shortName}</text><text class="region-label" x="${x.toFixed(1)}" y="${(y + 10).toFixed(1)}">${pctLabel}</text>`);
    }
    return `<path class="peru-region${isLake ? ' lake' : ''}" style="--region-color:${isLake ? '#d9ecff' : color}" d="${geometryToPath(feature.geometry, bounds, size)}"><title>${metric.name || name}: ${isLake ? 'Lago' : `${pct3(metric.percentage)} · ${fmt.format(metric.counted || 0)} actas`}</title></path>`;
  }).join('');
  const topRegions = topUniqueRegions(metrics);

  qs('mapCanvas').innerHTML = `    <div class="map-title">Actas contabilizadas por departamento</div>
    <svg class="peru-map" viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="Mapa oficial base de Perú por regiones ONPE">${paths}${labels.join('')}</svg>
    <div class="map-legend"><span>90%</span><i></i><span>100%</span></div>
    <div class="map-topline">${topRegions.map(region => `<span>${region.name}: <b>${pct3(region.percentage)}</b></span>`).join('')}</div>
    <p class="map-note">Mapa: ONPE/amCharts <code>peruLow.json</code> + <code>mapa-calor</code> por ámbito geográfico.</p>
  `;
}

function buildMapFeatures(features, metrics, rows = []) {
  const allowedNames = new Set(rows.map(row => normalizeText(row.ubicacion)));
  const hasFilter = allowedNames.size && rows.length < state.locations.length;

  return features
    .filter(feature => feature.properties?.TYPE !== 'Lake')
    .map(feature => {
      const name = feature.properties?.name || feature.id || 'Región';
      const featureKey = feature.properties?.id || feature.id;
      const metric = metrics.get(featureKey) || metrics.get(String(feature.id || '').padStart(6, '0')) || { name, percentage: 0, counted: 0 };
      const visible = !hasFilter || allowedNames.has(normalizeText(metric.name || name));
      return {
        ...feature,
        properties: {
          ...feature.properties,
          mapName: metric.name || name,
          percentage: Number(metric.percentage || 0),
          label: metric.percentage ? `${Math.round(metric.percentage)}%` : '',
          counted: Number(metric.counted || 0),
          color: visible ? regionColor(metric.percentage) : '#d7e0ea',
          opacity: visible ? 0.84 : 0.22
        }
      };
    });
}

function renderInteractiveMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw) {
  const geo = extractData(geoRaw) || geoRaw;
  const features = Array.isArray(geo?.features) ? geo.features : [];
  if (!features.length || !window.maplibregl) return false;

  const metrics = buildRegionMetrics(departamentosRaw, heatAmbitoRaw);
  const mapFeatures = buildMapFeatures(features, metrics, rows);
  const sourceData = { type: 'FeatureCollection', features: mapFeatures };
  const topRegions = topUniqueRegions(metrics);
  const allPoints = features.flatMap(feature => collectCoordinates(feature.geometry));
  const bounds = allPoints.reduce((acc, [lon, lat]) => ({
    minLon: Math.min(acc.minLon, lon),
    maxLon: Math.max(acc.maxLon, lon),
    minLat: Math.min(acc.minLat, lat),
    maxLat: Math.max(acc.maxLat, lat)
  }), { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity });

  qs('mapCanvas').innerHTML = `    <div class="map-scope"><span>Perú</span></div>
    <div class="map-title">Actas contabilizadas por departamento</div>
    <div class="map-host" id="openFreeMap"></div>
    <div class="map-legend"><span>90%</span><i></i><span>100%</span></div>
    <div class="map-topline">${topRegions.map(region => `<span>${escapeHtml(region.name)}: <b>${pct3(region.percentage)}</b></span>`).join('')}</div>
    <p class="map-note">Mapa base: OpenFreeMap + MapLibre. Datos: ONPE por ámbito geográfico.</p>
  `;

  state.mapReady = false;
  state.mapLayerReady = false;
  state.map = new maplibregl.Map({
    container: 'openFreeMap',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-75.0152, -9.19],
    zoom: 4.25,
    minZoom: 3.5,
    maxZoom: 14,
    attributionControl: false
  });
  state.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  state.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  state.map.on('load', () => {
    state.mapReady = true;
    state.map.addSource('onpe-regions', { type: 'geojson', data: sourceData });
    state.map.addLayer({
      id: 'onpe-region-fill',
      type: 'fill',
      source: 'onpe-regions',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': ['get', 'opacity']
      }
    });
    state.map.addLayer({
      id: 'onpe-region-line',
      type: 'line',
      source: 'onpe-regions',
      paint: {
        'line-color': '#102f59',
        'line-width': 1.2,
        'line-opacity': 0.58
      }
    });
    state.map.addLayer({
      id: 'onpe-region-label',
      type: 'symbol',
      source: 'onpe-regions',
      minzoom: 3,
      layout: {
        'text-field': ['get', 'label'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 5, 15, 8, 18],
        'text-font': ['Noto Sans Regular'],
        'text-allow-overlap': false,
        'text-ignore-placement': false
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#17304d',
        'text-halo-width': 1.45,
        'text-opacity': ['get', 'opacity']
      }
    });
    state.mapLayerReady = true;

    if (Number.isFinite(bounds.minLon)) {
      state.map.fitBounds([[bounds.minLon, bounds.minLat], [bounds.maxLon, bounds.maxLat]], {
        padding: { top: 58, right: 30, bottom: 92, left: 30 },
        duration: 0
      });
    }
  });

  state.map.on('mousemove', 'onpe-region-fill', event => {
    state.map.getCanvas().style.cursor = 'pointer';
    const feature = event.features?.[0];
    if (!feature) return;
    const props = feature.properties || {};
    if (state.mapPopup) state.mapPopup.remove();
    state.mapPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 })
      .setLngLat(geometryLngLatCenter(feature.geometry))
      .setHTML(`
        <strong>${escapeHtml(props.mapName)}</strong>
        <span>${pct3(props.percentage)} contabilizadas</span>
        <em>${fmt.format(props.counted || 0)} actas</em>
      `)
      .addTo(state.map);
  });

  state.map.on('mouseleave', 'onpe-region-fill', () => {
    state.map.getCanvas().style.cursor = '';
    if (state.mapPopup) state.mapPopup.remove();
  });

  state.map.on('error', () => {
    renderStaticMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw);
  });

  return true;
}

function renderMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw) {
  if (state.map) {
    state.map.remove();
    state.map = null;
    state.mapPopup = null;
  }
  const rendered = renderInteractiveMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw);
  if (!rendered) renderStaticMap(rows, geoRaw, departamentosRaw, heatAmbitoRaw);
}

function updateProcessInfo(procesoRaw, eleccionesRaw) {
  const proceso = deepFind(procesoRaw, ['nombreProceso', 'proceso', 'descripcion', 'nombre']) || 'Proceso electoral activo';
  const elecciones = Array.isArray(eleccionesRaw?.data) ? eleccionesRaw.data : Array.isArray(eleccionesRaw) ? eleccionesRaw : [];
  const principal = elecciones.find(item => item.esPrincipal) || elecciones.find(item => item.idEleccion === 10);
  const eleccion = principal?.descripcion || principal?.nombre || deepFind(eleccionesRaw, ['nombreEleccion', 'eleccion', 'descripcion', 'nombre']) || 'Elección presidencial';
  const processInfo = qs('processInfo');
  if (processInfo) processInfo.textContent = `${proceso} · ${eleccion}`;
}

function updateStatus(success) {
  const dot = qs('apiDot');
  dot.classList.remove('ok', 'error');
  if (success) {
    dot.classList.add('ok');
    qs('apiStatus').textContent = 'Fuente oficial parcial detectada';
  } else {
    dot.classList.add('error');
    qs('apiStatus').textContent = 'Esperando fuente oficial de ONPE';
  }
  const lastUpdate = qs('lastUpdate');
  if (lastUpdate) {
    lastUpdate.dataset.base = `Última actualización: ${new Date().toLocaleTimeString('es-PE')}`;
    updateRefreshCountdown();
  }
}

async function loadData() {
  if (state.loading) return;
  state.loading = true;
  qs('refreshBtn').disabled = true;
  qs('refreshBtn').textContent = 'Actualizando...';
  setupApiList();

  let procesoRaw, eleccionesRaw, totalsRaw, participantsRaw, locationsRaw, tablesRaw, heatRaw, departamentosRaw, mesasAmbitoRaw, totalsAmbitoRaw, heatAmbitoRaw, continentesExteriorRaw, heatExteriorRaw, presidencialExteriorRaw, mesasExteriorRaw, orgRaw, geoPeruRaw, geoRaw, ronbSnapshot, ronbProjection, ronbExterior;

  try {
    [ronbSnapshot, ronbProjection, ronbExterior, geoPeruRaw, geoRaw] = await Promise.all([
      getRonb('snapshot').catch(() => null),
      getRonb('proyeccion').catch(() => null),
      getRonb('exterior-paises').catch(() => null),
      getJson('geodataPeru', ASSET_URLS.geodataPeru).catch(() => null),
      getJson('geodataContinental', ASSET_URLS.geodataContinental).catch(() => null)
    ]);

    if (ronbSnapshot) {
      totalsRaw = ronbTotals(ronbSnapshot.national);
      participantsRaw = { data: ronbParticipants(ronbSnapshot) };
      departamentosRaw = { data: ronbDepartmentRefs(ronbSnapshot) };
      heatAmbitoRaw = { data: ronbHeatRows(ronbSnapshot) };
      totalsAmbitoRaw = { data: ronbTotalsByScope(ronbSnapshot) };
      presidencialExteriorRaw = ronbExteriorParticipants(ronbSnapshot);
    }
  } catch (e) {
    ronbSnapshot = null;
  }

  if (!ronbSnapshot) {
    try {
      [
        procesoRaw,
        eleccionesRaw,
        totalsRaw,
        participantsRaw,
        locationsRaw,
        tablesRaw,
        heatRaw,
        departamentosRaw,
        mesasAmbitoRaw,
        totalsAmbitoRaw,
        heatAmbitoRaw,
        continentesExteriorRaw,
        heatExteriorRaw,
        presidencialExteriorRaw,
        mesasExteriorRaw,
        orgRaw,
        geoPeruRaw,
        geoRaw
      ] = await Promise.all([
        getJson('procesoActivo', API_URLS.procesoActivo).catch(() => null),
        getJson('elecciones', API_URLS.elecciones).catch(() => null),
        getJson('resumenTotales', API_URLS.resumenTotales).catch(() => null),
        getJson('resumenParticipantes', API_URLS.resumenParticipantes).catch(() => null),
        getJson('presidencialPorUbicacion', API_URLS.presidencialPorUbicacion).catch(() => null),
        getJson('mesasTotales', API_URLS.mesasTotales).catch(() => null),
        getJson('mapaCalor', API_URLS.mapaCalor).catch(() => null),
        getJson('departamentos', API_URLS.departamentos).catch(() => null),
        getJson('mesasAmbito', API_URLS.mesasAmbito).catch(() => null),
        getJson('resumenTotalesAmbito', API_URLS.resumenTotalesAmbito).catch(() => null),
        getJson('mapaCalorAmbito', API_URLS.mapaCalorAmbito).catch(() => null),
        getOnpeUrl(endpoints.continentesExterior).catch(() => null),
        getOnpeUrl(endpoints.mapaCalorExterior).catch(() => null),
        getOnpeUrl(endpoints.presidencialExterior).catch(() => null),
        getOnpeUrl(endpoints.mesasExterior).catch(() => null),
        getJson('presidencialPorOrganizacion', API_URLS.presidencialPorOrganizacion).catch(() => null),
        getJson('geodataPeru', ASSET_URLS.geodataPeru).catch(() => null),
        getJson('geodataContinental', ASSET_URLS.geodataContinental).catch(() => null)
      ]);
    } catch (e) {
      console.warn('ONPE no disponible, usando datos de fallback', e);
    }
  }

  state.raw = { procesoRaw, eleccionesRaw, totalsRaw, participantsRaw, locationsRaw, tablesRaw, heatRaw, departamentosRaw, mesasAmbitoRaw, totalsAmbitoRaw, heatAmbitoRaw, continentesExteriorRaw, heatExteriorRaw, presidencialExteriorRaw, mesasExteriorRaw, orgRaw, geoPeruRaw, geoRaw, ronbSnapshot, ronbProjection, ronbExterior };
  state.ronbProjection = ronbProjection;
  state.ronbExterior = ronbExterior;

  const hasRealData = Boolean(ronbSnapshot || (totalsRaw && participantsRaw));

  // Usar datos reales o fallback cuando ONPE está bloqueado
  const mainTotalsRaw = totalsRaw || totalsAmbitoRaw;
  const mainMesasRaw = tablesRaw || mesasAmbitoRaw;
  const totals = mainTotalsRaw ? normalizeTotals(mainTotalsRaw, mainMesasRaw) : fallback.totals;

  const participants = ronbSnapshot ? ronbParticipants(ronbSnapshot) : hasRealData ? normalizeParticipants(orgRaw, participantsRaw) : fallback.participants;
  const locations = ronbSnapshot ? ronbDepartmentRows(ronbSnapshot) : hasRealData ? buildDepartmentRows(departamentosRaw, heatAmbitoRaw) : fallback.locations;
  const territoryDetailsRaw = ronbSnapshot ? ronbTerritoryRows(ronbSnapshot, ronbProjection || {}) : await loadTerritoryDetailRows(departamentosRaw, continentesExteriorRaw).catch(() => []);
  const territoryDetails = territoryDetailsRaw.length ? territoryDetailsRaw : fallback.territories;

  state.participants = participants;
  state.locations = locations;

  updateProcessInfo(procesoRaw, eleccionesRaw);
  updateKpis(totals);
  updateDuel(participants, mainTotalsRaw || totals);
  updateParticipationView();
  renderCandidates(participants);
  renderProjectionChart(participants, mainTotalsRaw || totals);
  try { renderPendingVote(territoryDetails); } catch (e) { console.warn('Pending vote failed', e); }
  try { renderJeeImpact(territoryDetails); } catch (e) { console.warn('JEE impact failed', e); }
  try { await renderWorldVote(continentesExteriorRaw, heatExteriorRaw, presidencialExteriorRaw); } catch (e) { console.warn('World vote failed', e); }
  renderMap(locations, geoPeruRaw, departamentosRaw, heatAmbitoRaw);
  renderLocations(locations);

  if (!hasRealData) {
    qs('apiStatus').textContent = 'ONPE bloqueado (Cloudflare). Usando datos de prueba.';
    qs('apiDot').classList.add('error');
  } else if (ronbSnapshot) {
    qs('apiStatus').textContent = 'Datos reales vía proxy RonBStudio';
    qs('apiDot').classList.remove('error');
    qs('apiDot').classList.add('ok');
    const lastUpdate = qs('lastUpdate');
    if (lastUpdate) {
      lastUpdate.dataset.base = `Última actualización: ${new Date(ronbSnapshot.ts || Date.now()).toLocaleTimeString('es-PE')}`;
      updateRefreshCountdown();
    }
  } else {
    updateStatus(true);
  }

  state.loading = false;
  qs('refreshBtn').disabled = false;
  qs('refreshBtn').textContent = 'Refrescar resultados';
  scheduleAutoRefresh();
}

document.addEventListener('DOMContentLoaded', () => {
  qs('refreshBtn').addEventListener('click', loadData);
  qs('participationScopeBtn').addEventListener('click', () => {
    state.participationScope = state.participationScope === 'foreign' ? 'peru' : 'foreign';
    updateParticipationView();
  });
  if (qs('regionSearch')) {
    qs('regionSearch').addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      const filtered = state.locations.filter(x => `${x.ubicacion} ${x.ganador}`.toLowerCase().includes(query));
      renderLocations(filtered);
      renderMap(filtered, state.raw.geoPeruRaw, state.raw.departamentosRaw, state.raw.heatAmbitoRaw);
    });
  }
  qs('continentFilter').addEventListener('change', () => renderWorldVoteRows(state.worldRows));
  qs('countryFilter').addEventListener('change', () => renderWorldVoteRows(state.worldRows));
  loadData();
});

