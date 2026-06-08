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
  totals: { procesadas: 0, contabilizadas: 0, participacion: 0, votosValidos: 0, mesasProcesadas: 0, mesasContabilizadas: 0 },
  participants: [],
  locations: []
};

const state = {
  raw: {},
  api: {},
  participants: [],
  locations: [],
  chart: null,
  map: null,
  mapPopup: null,
  mapReady: false,
  mapLayerReady: false,
  rankingMode: false,
  refreshTimer: null,
  nextRefreshAt: null,
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
    console.warn(`No se pudo cargar ${name}`, error);
    return null;
  }
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
    contabilizadas: toNumber(deepFind(raw, ['porcentajeActasContabilizadas', 'actasContabilizadas', 'contabilizadas', 'porcActasContabilizadas', 'avanceContabilizadas'])),
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
  qs('processedActs').textContent = pct(t.procesadas);
  qs('countedActs').textContent = pct(t.contabilizadas);
  qs('participation').textContent = pct(t.participacion);
  qs('validVotes').textContent = t.votosValidos ? fmt.format(t.votosValidos) : '--';
  qs('processedBar').style.width = `${Math.min(t.procesadas, 100)}%`;
  qs('countedBar').style.width = `${Math.min(t.contabilizadas, 100)}%`;
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
  return candidatePhotos[normalized] || '';
}

function candidateFallbackPhoto(name = '') {
  const normalized = normalizeText(name);
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

function renderChart(items) {
  const canvas = qs('voteChart');
  if (!window.Chart || !canvas) return;
  if (state.chart) state.chart.destroy();
  const totalsRaw = state.raw.totalsRaw;
  const data = extractData(totalsRaw) || {};
  const emitted = toNumber(data.totalVotosEmitidos);
  const valid = toNumber(data.totalVotosValidos);
  const participation = toNumber(data.participacionCiudadana);
  const registered = participation ? Math.round(emitted / (participation / 100)) : 0;
  const blankNull = Math.max(emitted - valid, 0);
  const noVote = Math.max(registered - emitted, 0);
  if (!registered) return;
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

function renderProjectionChart(participants, totalsRaw) {
  const canvas = qs('projectionChart');
  if (!window.Chart || !canvas) return;
  if (state.projectionChart) state.projectionChart.destroy();

  const data = extractData(totalsRaw) || {};
  const counted = Math.max(toNumber(data.actasContabilizadas || data.porcentajeActasContabilizadas), 1);
  const keiko = participants.find(p => normalizeText(p.organizacion).includes('FUERZA'));
  const roberto = participants.find(p => normalizeText(p.organizacion).includes('JUNTOS'));
  if (!keiko || !roberto) return;

  const currentX = Math.min(counted, 99);
  const targetX = 100;
  const kCurrent = Number(keiko.porcentaje || 0);
  const rCurrent = Number(roberto.porcentaje || 0);
  const remainingInfluence = Math.max(0.08, (100 - currentX) / 100);
  const kProjected = Math.max(0, Math.min(100, kCurrent + (kCurrent - 50) * remainingInfluence * 0.18));
  const rProjected = Math.max(0, Math.min(100, 100 - kProjected));
  const leader = kProjected >= rProjected ? keiko : roberto;
  const gap = Math.abs(kProjected - rProjected);

  const note = qs('projectionNote');
  if (note) {
    note.textContent = `Estimación visual no oficial al 100%: ${shortCandidateName(leader.nombre)} mantiene una ventaja aproximada de ${gap.toFixed(3)} puntos si el patrón actual no cambia.`;
  }

  state.projectionChart = new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Keiko Fujimori',
          data: [
            { x: 0, y: Math.min(58, kCurrent + 3.6) },
            { x: Math.max(12, currentX * .34), y: Math.min(56, kCurrent + 1.9) },
            { x: Math.max(40, currentX * .68), y: Math.min(54, kCurrent + .8) },
            { x: currentX, y: kCurrent },
            { x: targetX, y: kProjected }
          ],
          borderColor: '#ff7426',
          backgroundColor: '#ff7426',
          tension: .35,
          pointRadius: ctx => ctx.dataIndex >= 3 ? 4 : 0,
          pointHoverRadius: 6,
          borderWidth: 3
        },
        {
          label: 'Roberto Sánchez',
          data: [
            { x: 0, y: Math.max(42, rCurrent - 3.6) },
            { x: Math.max(12, currentX * .34), y: Math.max(44, rCurrent - 1.9) },
            { x: Math.max(40, currentX * .68), y: Math.max(46, rCurrent - .8) },
            { x: currentX, y: rCurrent },
            { x: targetX, y: rProjected }
          ],
          borderColor: '#d42634',
          backgroundColor: '#d42634',
          tension: .35,
          pointRadius: ctx => ctx.dataIndex >= 3 ? 4 : 0,
          pointHoverRadius: 6,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 100,
          grid: { color: 'rgba(16,47,89,.1)' },
          ticks: { callback: value => `${value}%`, color: '#375779', font: { weight: 700 } },
          title: { display: true, text: '% de actas contabilizadas', color: '#183a5f', font: { weight: 900 } }
        },
        y: {
          min: 41,
          max: 59,
          grid: { color: 'rgba(16,47,89,.1)' },
          ticks: { callback: value => `${value}%`, color: '#375779', font: { weight: 700 } },
          title: { display: true, text: '% de votos válidos', color: '#183a5f', font: { weight: 900 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${Number(ctx.parsed.y || 0).toFixed(3)}%`
          }
        }
      }
    },
    plugins: [{
      id: 'projectionGuide',
      afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const y50 = scales.y.getPixelForValue(50);
        const xCurrent = scales.x.getPixelForValue(currentX);
        const xEnd = scales.x.getPixelForValue(100);
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = 'rgba(16,47,89,.34)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y50);
        ctx.lineTo(chartArea.right, y50);
        ctx.stroke();
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(xCurrent, chartArea.top);
        ctx.lineTo(xCurrent, chartArea.bottom);
        ctx.stroke();
        ctx.fillStyle = 'rgba(16,47,89,.56)';
        ctx.font = '700 11px Source Sans 3';
        ctx.fillText('Mayoría 50%', chartArea.left + 4, y50 - 7);
        ctx.fillText('Proyección', Math.min(xCurrent + 8, xEnd - 72), chartArea.top + 14);
        ctx.restore();
      }
    }]
  });
}

function renderLocations(rows = state.locations) {
  const topRows = rows.slice(0, 80);
  qs('locationRows').innerHTML = topRows.map(x => `
    <tr>
      <td>${x.ubicacion}</td>
      <td>${x.ganador}</td>
      <td>${x.votos ? fmt.format(x.votos) : '--'}</td>
      <td>${pct(x.porcentaje)}</td>
    </tr>
  `).join('') || '<tr><td colspan="4">No se encontraron datos de ubicación en la respuesta actual.</td></tr>';
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
  const kProjected = Math.max(0, Math.min(100, kCurrent + (kCurrent - 50) * remainingInfluence * 0.18));
  const rProjected = Math.max(0, Math.min(100, 100 - kProjected));
  const leader = kProjected >= rProjected ? keiko : roberto;
  const gap = Math.abs(kProjected - rProjected);
  const x = value => 84 + (value / 100) * 776;
  const y = value => 292 - ((value - 41) / 18) * 220;
  const projectionX = x(currentX);
  const kPts = [[x(0), y(Math.min(58, kCurrent + 3.8))], [x(8), y(kCurrent + 2.6)], [x(24), y(kCurrent + 1.5)], [x(46), y(kCurrent + .8)], [x(68), y(kCurrent + .45)], [projectionX, y(kCurrent)], [x(100), y(kProjected)]];
  const rPts = [[x(0), y(Math.max(42, rCurrent - 3.8))], [x(8), y(rCurrent - 2.6)], [x(24), y(rCurrent - 1.5)], [x(46), y(rCurrent - .8)], [x(68), y(rCurrent - .45)], [projectionX, y(rCurrent)], [x(100), y(rProjected)]];

  const note = qs('projectionNote');
  if (note) {
    note.textContent = `Dibujo estimado no oficial: todavia falta escrutar. Si el patron actual se mantiene, ${shortCandidateName(leader.nombre)} conservaria una ventaja aproximada de ${gap.toFixed(3)} puntos al cierre.`;
  }

  mount.innerHTML = `
    <svg viewBox="0 0 940 360" role="img" aria-label="Dibujo estimado de evolucion electoral">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#9aa8b9" stroke-width="1" opacity=".32"/>
        </pattern>
      </defs>
      <rect class="sketch-paper" x="18" y="18" width="904" height="324" rx="22"/>
      <g class="sketch-grid">
        ${[41,44,47,50,53,56,59].map(v => `<line x1="84" y1="${y(v)}" x2="860" y2="${y(v)}"/><text x="48" y="${y(v) + 4}">${v}%</text>`).join('')}
        ${[0,20,40,60,80,100].map(v => `<line x1="${x(v)}" y1="72" x2="${x(v)}" y2="292"/><text x="${x(v) - 8}" y="320">${v}%</text>`).join('')}
      </g>
      <rect class="projection-zone" x="${projectionX}" y="72" width="${x(100) - projectionX}" height="220" fill="url(#hatch)"/>
      <line class="majority-line" x1="84" y1="${y(50)}" x2="860" y2="${y(50)}"/>
      <text class="majority-label" x="88" y="${y(50) - 8}">Mayoria 50%</text>
      <text class="axis-label y-axis" x="30" y="192">% votos validos</text>
      <text class="axis-label" x="412" y="346">% actas contabilizadas</text>
      <text class="projection-word" x="${Math.max(projectionX + 12, 742)}" y="90">TRAMO PENDIENTE</text>
      <path class="sketch-line keiko-line" d="${sketchPath(kPts)}"/>
      <path class="sketch-line roberto-line" d="${sketchPath(rPts)}"/>
      <path class="projection-dash keiko-dash" d="M${projectionX.toFixed(1)} ${y(kCurrent).toFixed(1)} L${x(100).toFixed(1)} ${y(kProjected).toFixed(1)}"/>
      <path class="projection-dash roberto-dash" d="M${projectionX.toFixed(1)} ${y(rCurrent).toFixed(1)} L${x(100).toFixed(1)} ${y(rProjected).toFixed(1)}"/>
      <circle class="end-dot keiko-end" cx="${x(100)}" cy="${y(kProjected)}" r="5"/>
      <circle class="end-dot roberto-end" cx="${x(100)}" cy="${y(rProjected)}" r="5"/>
      <g class="winner-note" transform="translate(${Math.min(x(100) - 132, 780)} ${Math.min(y(Math.max(kProjected, rProjected)) - 28, 118)})"><rect width="132" height="54" rx="13"/><text x="12" y="22">${escapeHtml(shortCandidateName(leader.nombre))}</text><text x="12" y="42">+${gap.toFixed(3)} pts</text></g>
      <text class="end-label keiko-label" x="868" y="${y(kProjected) - 8}">${kProjected.toFixed(3)}%</text>
      <text class="end-label roberto-label" x="868" y="${y(rProjected) + 18}">${rProjected.toFixed(3)}%</text>
    </svg>
  `;
}

function renderLocations(rows = state.locations) {
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
        'text-font': ['Open Sans Bold'],
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
    lastUpdate.dataset.base = `Última actualización: ${new Date().toLocaleString('es-PE')}`;
    updateRefreshCountdown();
  }
}

async function loadData() {
  if (state.loading) return;
  state.loading = true;
  qs('refreshBtn').disabled = true;
  qs('refreshBtn').textContent = 'Actualizando...';
  setupApiList();

  const [
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
    orgRaw,
    geoPeruRaw,
    geoRaw
  ] = await Promise.all([
    getJson('procesoActivo', API_URLS.procesoActivo),
    getJson('elecciones', API_URLS.elecciones),
    getJson('resumenTotales', API_URLS.resumenTotales),
    getJson('resumenParticipantes', API_URLS.resumenParticipantes),
    getJson('presidencialPorUbicacion', API_URLS.presidencialPorUbicacion),
    getJson('mesasTotales', API_URLS.mesasTotales),
    getJson('mapaCalor', API_URLS.mapaCalor),
    getJson('departamentos', API_URLS.departamentos),
    getJson('mesasAmbito', API_URLS.mesasAmbito),
    getJson('resumenTotalesAmbito', API_URLS.resumenTotalesAmbito),
    getJson('mapaCalorAmbito', API_URLS.mapaCalorAmbito),
    getJson('presidencialPorOrganizacion', API_URLS.presidencialPorOrganizacion),
    getJson('geodataPeru', ASSET_URLS.geodataPeru),
    getJson('geodataContinental', ASSET_URLS.geodataContinental)
  ]);

  state.raw = { procesoRaw, eleccionesRaw, totalsRaw, participantsRaw, locationsRaw, tablesRaw, heatRaw, departamentosRaw, mesasAmbitoRaw, totalsAmbitoRaw, heatAmbitoRaw, orgRaw, geoPeruRaw, geoRaw };

  // Usar siempre el dato nacional para el contador principal y el duelo
  const mainTotalsRaw = totalsRaw || totalsAmbitoRaw;
  const mainMesasRaw = tablesRaw || mesasAmbitoRaw;
  const totals = mainTotalsRaw ? normalizeTotals(mainTotalsRaw, mainMesasRaw) : fallback.totals;

  const participants = normalizeParticipants(orgRaw, participantsRaw);
  const locations = buildDepartmentRows(departamentosRaw, heatAmbitoRaw);

  state.participants = participants;
  state.locations = locations;

  updateProcessInfo(procesoRaw, eleccionesRaw);
  updateKpis(totals);
  updateDuel(participants, mainTotalsRaw);
  updateParticipation(mainTotalsRaw);
  renderCandidates(participants);
  renderChart(participants);
  renderProjectionChart(participants, mainTotalsRaw);
  renderMap(locations, geoPeruRaw, departamentosRaw, heatAmbitoRaw);
  renderLocations(locations);
  updateStatus(Boolean(totalsRaw || participantsRaw || locationsRaw || heatRaw || orgRaw || geoRaw));
  state.loading = false;
  qs('refreshBtn').disabled = false;
  qs('refreshBtn').textContent = 'Refrescar resultados';
  scheduleAutoRefresh();
}

document.addEventListener('DOMContentLoaded', () => {
  qs('refreshBtn').addEventListener('click', loadData);
  qs('regionSearch').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    const filtered = state.locations.filter(x => `${x.ubicacion} ${x.ganador}`.toLowerCase().includes(query));
    renderLocations(filtered);
    renderMap(filtered, state.raw.geoPeruRaw, state.raw.departamentosRaw, state.raw.heatAmbitoRaw);
  });
  loadData();
});

